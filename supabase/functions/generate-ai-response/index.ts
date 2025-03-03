
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface PlayerProfile {
  id: string;
  name: string;
  archetype: string;
  traits: string[];
  personality: string;
  backstory: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Get supabase client
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Get OpenAI key
  const openaiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openaiKey) {
    return new Response(
      JSON.stringify({ error: "OpenAI API key is not configured" }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }

  try {
    // Parse request body
    const { playerProfile, gamePhase, situation, recentMemory, context, responseType, includeEmotion } = await req.json();

    // Build the prompt based on responseType
    let systemPrompt = "";
    let userPrompt = "";

    if (responseType === "dialogue") {
      systemPrompt = `You are ${playerProfile.name}, a contestant on the reality TV show Big Brother. 
You are a ${playerProfile.archetype} player with these traits: ${playerProfile.traits.join(", ")}.
Personality: ${playerProfile.personality}
Backstory: ${playerProfile.backstory}

You will respond in character, speaking as this player would, reflecting your unique personality and gameplay style.
Your response should be ONE short paragraph (2-3 sentences maximum).
Include subtle hints about your strategy and feelings toward others when appropriate.`;

      userPrompt = `Current Game Phase: ${gamePhase}
Recent Memory: ${recentMemory || "No recent significant events."}
Current Situation: ${situation}
${JSON.stringify(context, null, 2)}

How do you respond to this situation? Express your authentic reaction as ${playerProfile.name}.`;
    } 
    else if (responseType === "decision") {
      systemPrompt = `You are ${playerProfile.name}, a strategic player on Big Brother. 
You are a ${playerProfile.archetype} player with these traits: ${playerProfile.traits.join(", ")}.
Your goal is to make game decisions that align with your personality and gameplay style.
You will provide a clear decision and a brief explanation of your reasoning.`;

      userPrompt = `Current Game Phase: ${gamePhase}
Recent Memory: ${recentMemory || "No recent significant events."}
Decision Required: ${situation}
Options: ${JSON.stringify(context.options)}
Players: ${JSON.stringify(context.players, null, 2)}

What is your decision as ${playerProfile.name}? Provide your choice and a brief reasoning.`;
    }

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error("No response from OpenAI API");
    }

    let emotion = "neutral";
    let generated_text = data.choices[0].message.content.trim();

    // Determine emotion if requested
    if (includeEmotion) {
      // Simplified emotion detection based on text content
      const emotionResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { 
              role: "system", 
              content: "You are an emotion analyzer. Identify the primary emotion in this text and return ONLY one of these emotions: happy, sad, angry, surprised, scared, disgusted, neutral, excited, anxious, confident, suspicious" 
            },
            { role: "user", content: generated_text }
          ],
          temperature: 0.3,
          max_tokens: 10
        })
      });

      const emotionData = await emotionResponse.json();
      if (emotionData.choices && emotionData.choices.length > 0) {
        emotion = emotionData.choices[0].message.content.trim().toLowerCase();
      }
    }

    // Store the response in memory if applicable
    if (playerProfile.id && responseType === "dialogue") {
      try {
        await supabase.from('ai_memory_entries').insert({
          player_id: playerProfile.id,
          type: 'dialogue',
          description: `Said: "${generated_text}" (${emotion}) during ${gamePhase}`,
          impact: 'neutral',
          importance: 2,
          week: context.week || 1,
          timestamp: new Date().toISOString()
        });
      } catch (memoryError) {
        console.error("Error storing memory:", memoryError);
        // Continue even if memory storage fails
      }
    }

    return new Response(
      JSON.stringify({ 
        generated_text, 
        emotion, 
        type: responseType 
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error("Error in generate-ai-response function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  }
});
