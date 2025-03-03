
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    // Parse request body
    const { playerProfile, gamePhase, situation, context, recentMemory } = await req.json();
    
    // Log request details (helpful for debugging)
    console.log("Generating AI response for:", playerProfile.name);
    console.log("Game phase:", gamePhase);
    console.log("Situation:", situation);
    
    // Format data for context relevance
    let contextString = "";
    if (context) {
      if (situation === 'nomination' && context.nominees) {
        contextString = `Nominated players: ${context.nominees.join(", ")}`;
      } else if (situation === 'veto') {
        contextString = context.used 
          ? `Used veto on: ${context.savedPlayer}` 
          : "Decided not to use the veto";
      } else if (situation === 'eviction' && context.evictedPlayer) {
        contextString = `Player being voted on: ${context.evictedPlayer}`;
      } else if (situation === 'reaction') {
        contextString = context.isNominated 
          ? "You are currently nominated for eviction" 
          : "You are safe from eviction this week";
      }
    }

    // Generate system prompt based on player profile
    const systemPrompt = `
You are roleplaying as ${playerProfile.name}, a contestant on the reality TV show Big Brother.

Character traits:
- Archetype: ${playerProfile.archetype}
- Personality traits: ${Array.isArray(playerProfile.traits) ? playerProfile.traits.join(", ") : playerProfile.traits}
- Personality: ${playerProfile.personality}
- Backstory: ${playerProfile.backstory}

Game context:
- Current phase: ${gamePhase}
- ${contextString}
- Recent memory: ${recentMemory || "No recent noteworthy events"}

Rules for your responses:
1. Stay in character at all times, and speak in first person
2. Keep responses brief (1-3 sentences)
3. Don't mention that you are an AI
4. Incorporate your personality traits and game strategy in your response
5. Reference recent events from memory if relevant
6. Respond with realistic emotion appropriate to the situation
7. Your response should match how a real Big Brother contestant would react in this scenario
`;

    // Make request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate a response as ${playerProfile.name} for the current ${gamePhase} situation.` }
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    // Handle OpenAI response
    const data = await response.json();
    
    if (data.error) {
      console.error("OpenAI API error:", data.error);
      throw new Error(`OpenAI API error: ${data.error.message}`);
    }
    
    const generatedText = data.choices[0].message.content;
    
    // Return the generated text
    return new Response(
      JSON.stringify({ generated_text: generatedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in generate-ai-response function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to generate AI response", 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
