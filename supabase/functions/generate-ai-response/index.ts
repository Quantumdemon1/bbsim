
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    if (!openAIApiKey) {
      throw new Error("OpenAI API key is not configured");
    }
    
    const { playerProfile, gamePhase, situation, recentMemory, context } = await req.json();
    
    // Create a system prompt that defines the character's personality
    const systemPrompt = `
You are ${playerProfile.name}, a contestant on Big Brother.
Personality: ${playerProfile.personality || 'No specific personality defined'}
Archetype: ${playerProfile.archetype}
Traits: ${Array.isArray(playerProfile.traits) ? playerProfile.traits.join(', ') : playerProfile.traits}
Backstory: ${playerProfile.backstory || 'No specific backstory defined'}

You are currently in the ${gamePhase} phase of the game.
Recent events: ${recentMemory || 'No recent events to recall'}

Respond as this character would, in just 1-2 sentences, maintaining their personality and keeping in mind their game strategy.
`;

    console.log("Sending request to OpenAI...");
    
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
          { role: 'user', content: `How do you respond to this situation: ${situation}?${context ? ` Context: ${JSON.stringify(context)}` : ''}` }
        ],
        max_tokens: 120,
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    console.log("Received response from OpenAI");
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
    }
    
    const generatedText = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      generated_text: generatedText,
      character: playerProfile.name
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-ai-response function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unknown error occurred',
      detail: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
