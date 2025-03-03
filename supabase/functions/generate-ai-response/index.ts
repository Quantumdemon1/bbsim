import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const openAIKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIKey) {
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const requestData = await req.json();
    const { 
      playerProfile, 
      gamePhase, 
      situation, 
      context, 
      recentMemory, 
      responseType, 
      includeEmotion 
    } = requestData;

    console.log(`Processing ${responseType} request for player ${playerProfile.name} in ${gamePhase}`);

    let systemPrompt = '';
    let userPrompt = '';

    if (responseType === 'dialogue') {
      systemPrompt = `You are ${playerProfile.name}, a contestant on the reality TV show Big Brother. 
Your personality is defined as a "${playerProfile.archetype}" archetype with traits including ${playerProfile.traits.join(', ')}.
Background: ${playerProfile.personality}
Motivation: ${playerProfile.backstory}

Respond in-character as ${playerProfile.name} would speak during a confessional or in the Big Brother house.
Keep responses concise (30-60 words), authentic to your character, and reflective of your game strategy.
${includeEmotion ? "At the end of your response, on a new line, indicate the emotion you are feeling (happy, sad, angry, excited, nervous, strategic, neutral)." : ""}`;

      userPrompt = `Current situation: ${gamePhase}
${recentMemory ? `Recent events: ${recentMemory}` : ''}
Context: ${JSON.stringify(context)}

What would you say in this ${situation} situation?`;
    } 
    else if (responseType === 'decision') {
      systemPrompt = `You are ${playerProfile.name}, a contestant on the reality TV show Big Brother.
Your personality is defined as a "${playerProfile.archetype}" archetype with traits including ${playerProfile.traits.join(', ')}.
Background: ${playerProfile.personality}
Motivation: ${playerProfile.backstory}

You need to make a strategic game decision that aligns with your character's personality, traits, and game position.
Respond with a decision and a brief explanation of your reasoning.`;

      const { decisionType, options } = requestData.gameContext;
      userPrompt = `You need to make a ${decisionType} decision.
Your options are: ${JSON.stringify(options)}
${recentMemory ? `Recent events to consider: ${recentMemory}` : ''}

Respond in the following JSON format:
{
  "selectedOption": "[name of your choice]",
  "reasoning": "[1-2 sentence explanation of why you made this choice]"
}`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
    }

    const content = data.choices[0].message.content;

    // Process the response based on type
    if (responseType === 'dialogue' && includeEmotion) {
      const lines = content.split('\n').filter(line => line.trim());
      let generatedText = lines[0];
      let emotion = 'neutral';
      
      // Check if there's an emotion indicator in the last line
      if (lines.length > 1) {
        const lastLine = lines[lines.length - 1].toLowerCase();
        const emotions = ['happy', 'sad', 'angry', 'excited', 'nervous', 'strategic', 'neutral'];
        for (const e of emotions) {
          if (lastLine.includes(e)) {
            emotion = e;
            break;
          }
        }
        // Keep all but the last line if we found an emotion
        generatedText = lines.slice(0, -1).join('\n');
      }
      
      return new Response(
        JSON.stringify({ generated_text: generatedText, emotion }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } 
    else if (responseType === 'decision') {
      try {
        // Try to parse JSON from the response
        const decisionData = JSON.parse(content);
        return new Response(
          JSON.stringify(decisionData),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (e) {
        // If parsing fails, return a structured response with the full text
        console.error('Failed to parse decision JSON:', e);
        return new Response(
          JSON.stringify({ 
            selectedOption: null, 
            reasoning: content 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } 
    else {
      // Default case - just return the generated text
      return new Response(
        JSON.stringify({ generated_text: content }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in generate-ai-response:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
