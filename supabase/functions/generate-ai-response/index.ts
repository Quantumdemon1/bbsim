
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      playerProfile, 
      gamePhase, 
      situation, 
      context, 
      recentMemory,
      gameContext,
      responseType = 'dialogue' 
    } = await req.json();
    
    console.log(`Generating ${responseType} for player: ${playerProfile.name}`);

    let prompt = '';
    let systemMessage = '';
    
    if (responseType === 'dialogue') {
      // Format system message for dialogue generation
      systemMessage = `You are ${playerProfile.name}, a contestant on a reality TV show similar to Big Brother. 
You are a ${playerProfile.archetype} player. Your personality traits include: ${playerProfile.traits.join(', ')}.
Background: ${playerProfile.personality}
Motivation: ${playerProfile.backstory}

Respond in-character as ${playerProfile.name} with a short, dramatic, and TV-worthy statement about the current situation.
Keep your response to 1-3 sentences maximum. Use realistic, casual speech patterns.`;

      // Format prompt based on the current game phase
      prompt = `Current situation: ${gamePhase}
${recentMemory ? `Recent events in the game: ${recentMemory}` : ''}`;

      // Add context-specific details to the prompt
      switch (situation) {
        case 'nomination':
          prompt += `\nYou are the Head of Household and have nominated ${context.nominees?.join(' and ')} for eviction. Explain your nominations.`;
          break;
        case 'veto':
          if (context.used) {
            prompt += `\nYou have the Power of Veto and you've decided to use it to save ${context.savedPlayer}. Explain your decision.`;
          } else {
            prompt += `\nYou have the Power of Veto but have decided not to use it. Explain why you're keeping nominations the same.`;
          }
          break;
        case 'eviction':
          prompt += `\nIt's eviction night and you've voted to evict ${context.evictedPlayer}. Explain your vote.`;
          break;
        case 'hoh':
          prompt += `\nYou've just won Head of Household! Discuss how this power will impact your game.`;
          break;
        case 'reaction':
          if (context.isNominated) {
            prompt += `\nYou've been nominated for eviction. React to being put on the block.`;
          } else {
            prompt += `\nYou're safe from eviction this week. React to your current position in the game.`;
          }
          break;
        case 'general':
          prompt += `\nShare your current thoughts on the game, your strategy, or other houseguests.`;
          break;
      }
    } else if (responseType === 'decision') {
      // Format system message for decision generation
      systemMessage = `You are an AI assistant helping to model the decision-making process of ${playerProfile.name}, 
a contestant on a reality TV show similar to Big Brother. 
${playerProfile.name} is a ${playerProfile.archetype} player with the following traits: ${playerProfile.traits.join(', ')}.
Background: ${playerProfile.personality}
Motivation: ${playerProfile.backstory}
Attributes - Physical: ${playerProfile.attributes.physical}/5, Strategic: ${playerProfile.attributes.strategic}/5, 
Social: ${playerProfile.attributes.social}/5, Loyalty: ${playerProfile.attributes.loyalty}/5

Your task is to determine what decision ${playerProfile.name} would make in the current game situation, 
based on their personality, traits, and game position.`;

      // Format prompt based on decision type
      prompt = `Decision type: ${gameContext.decisionType}
${recentMemory ? `Recent game events: ${recentMemory}` : ''}
Current game week: ${gameContext.week}
Current game phase: ${gameContext.phase}`;

      switch (gameContext.decisionType) {
        case 'nominate':
          prompt += `\n${playerProfile.name} is Head of Household and needs to nominate two players for eviction.
Available options: ${gameContext.options.map(o => o.name).join(', ')}
For each option, consider their archetype, traits, and relationship with ${playerProfile.name}.
Who would ${playerProfile.name} nominate as a ${playerProfile.archetype} player, and why?`;
          break;
        case 'vote':
          prompt += `\n${playerProfile.name} needs to vote for eviction.
Available options (nominees): ${gameContext.options.map(o => o.name).join(', ')}
For each nominee, consider their archetype, traits, and relationship with ${playerProfile.name}.
Who would ${playerProfile.name} vote to evict as a ${playerProfile.archetype} player, and why?`;
          break;
        case 'veto':
          prompt += `\n${playerProfile.name} has won the Power of Veto and needs to decide whether to use it and on whom.
Available options (nominees): ${gameContext.options.map(o => o.name).join(', ')}
For each nominee, consider their archetype, traits, and relationship with ${playerProfile.name}.
Would ${playerProfile.name} use the veto as a ${playerProfile.archetype} player? If so, on whom? Why?`;
          break;
        case 'alliance':
          prompt += `\n${playerProfile.name} is considering forming an alliance.
Available options (players): ${gameContext.options.map(o => o.name).join(', ')}
For each player, consider their archetype, traits, and relationship with ${playerProfile.name}.
With whom would ${playerProfile.name} want to form an alliance as a ${playerProfile.archetype} player, and why?`;
          break;
      }

      prompt += `\n\nRespond with a JSON object containing:
1. "selectedOption": The name of the selected player (or null if not using veto)
2. "reasoning": A brief explanation (1-2 sentences) of why this decision was made

Example:
{
  "selectedOption": "Alex",
  "reasoning": "As a strategic player, I'm targeting Alex because they're a competition threat."
}`;
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: responseType === 'dialogue' ? 150 : 300,
      }),
    });

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      console.error('Invalid response from OpenAI:', data);
      throw new Error('Invalid response from OpenAI');
    }

    const content = data.choices[0].message.content;
    
    // Process the response based on type
    let result;
    if (responseType === 'dialogue') {
      result = { generated_text: content.trim() };
    } else {
      try {
        // Extract JSON from the response - handle cases where the model might
        // include explanatory text before or after the JSON
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : content;
        const parsed = JSON.parse(jsonString);
        
        result = {
          selectedOption: parsed.selectedOption,
          reasoning: parsed.reasoning
        };
      } catch (e) {
        console.error('Error parsing decision JSON:', e, 'Content:', content);
        result = {
          selectedOption: null,
          reasoning: "Decision could not be determined."
        };
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-ai-response function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      generated_text: "I'm facing some challenges right now. Let me collect my thoughts."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
