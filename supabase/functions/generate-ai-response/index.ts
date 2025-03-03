
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.2.1'

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle OpenAI API responses
interface OpenAIResponse {
  choices: {
    text: string;
    index: number;
    logprobs: any;
    finish_reason: string;
  }[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const openaiKey = Deno.env.get('OPENAI_API_KEY') || '';

    // Initialize OpenAI
    const configuration = new Configuration({
      apiKey: openaiKey,
    });
    const openai = new OpenAIApi(configuration);

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Parse request body
    const { playerProfile, gamePhase, situation, recentMemory, context } = await req.json();
    
    console.log(`Generating response for ${playerProfile.name} in ${gamePhase} situation`);
    
    // Construct the prompt for OpenAI
    const prompt = `
      You are ${playerProfile.name}, a Big Brother contestant with the following traits:
      Archetype: ${playerProfile.archetype}
      Key Traits: ${Array.isArray(playerProfile.traits) ? playerProfile.traits.join(", ") : playerProfile.traits}
      Personality: ${playerProfile.personality}
      Backstory: ${playerProfile.backstory || "No specific backstory available."}
      
      Recent game events: ${recentMemory || "No recent events to recall."}
      
      You are currently in the ${gamePhase} phase of the game.
      
      Based on your personality and the current situation (${situation}), respond in character to the following:
      ${JSON.stringify(context)}
      
      Your response should be 1-3 sentences, in the first person, and reflect your personality and game strategy. Do not include quotation marks in your response.
    `;

    // If OpenAI key isn't set up, return a placeholder response
    if (!openaiKey) {
      console.warn("OpenAI API key not set, returning fallback response");
      return new Response(
        JSON.stringify({
          generated_text: `As ${playerProfile.name}, I need to think strategically about this situation. This game is all about adapting and making the right moves at the right time.`
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Call OpenAI API
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 100,
      temperature: 0.7,
    });

    const response = completion.data as OpenAIResponse;
    const generated_text = response.choices[0].text.trim();
    
    console.log(`Generated response: ${generated_text}`);

    return new Response(
      JSON.stringify({ generated_text }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error("Error in generate-ai-response function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Error generating AI response",
        details: error.message
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
});
