
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface PlayerProfile {
  id: string;
  name: string;
  archetype: string;
  traits: string[];
  personality: string;
  backstory: string;
  attributes?: Record<string, number>;
}

interface GameContext {
  phase: string;
  week: number;
  options?: any[];
  players?: any[];
  alliances?: any[];
  storylineId?: string;
  eventType?: string;
  previousEvents?: any[];
  playerChoices?: Record<string, string>;
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
    const {
      playerProfile,
      gamePhase,
      situation,
      recentMemory,
      context,
      responseType,
      includeEmotion,
      eventStoryline
    } = await req.json();

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
    else if (responseType === "storyEvent") {
      systemPrompt = `You are an AI story generator for a Big Brother game simulation. Your job is to create engaging, realistic storyline events that feel authentic to the Big Brother reality show.

For each request, you'll generate a complete story event with:
1. A compelling title and description
2. Meaningful choices for the player
3. Realistic consequences that should impact relationships and game dynamics
4. Context-awareness of the current game state (nominations, alliances, etc.)

Make the events feel personalized to the player's current situation and the personalities of other houseguests.`;

      const gameContext = context as GameContext;
      
      userPrompt = `Current Game State:
- Week: ${gameContext.week}
- Phase: ${gameContext.phase}
- Player Traits: ${playerProfile.traits.join(", ")}
- Player Archetype: ${playerProfile.archetype}
${gameContext.alliances ? `- Active Alliances: ${JSON.stringify(gameContext.alliances)}` : ''}
${gameContext.storylineId ? `- Storyline ID: ${gameContext.storylineId}` : ''}
${gameContext.eventType ? `- Event Type: ${gameContext.eventType}` : ''}

${gameContext.previousEvents ? `Previous Events in this Storyline:
${JSON.stringify(gameContext.previousEvents)}` : ''}

${gameContext.playerChoices ? `Player's Previous Choices:
${JSON.stringify(gameContext.playerChoices)}` : ''}

Recent Memory: ${recentMemory || "No recent significant events."}

Please generate a story event that:
1. Feels natural in the current game context
2. Offers meaningful choices with real consequences
3. Creates drama or strategic opportunities
4. Relates to the current phase and player's situation
`;
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
        max_tokens: responseType === "storyEvent" ? 1000 : 150
      })
    });

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error("No response from OpenAI API");
    }

    let emotion = "neutral";
    let generated_text = data.choices[0].message.content.trim();
    let storyEvent = null;

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

    // Parse story event response if that was the request type
    if (responseType === "storyEvent") {
      try {
        // Try to extract JSON from the response if it's enclosed in backticks
        const jsonMatch = generated_text.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          storyEvent = JSON.parse(jsonMatch[1]);
        } else {
          // If no JSON formatting, try to parse the entire response
          storyEvent = JSON.parse(generated_text);
        }
      } catch (error) {
        console.error("Failed to parse story event JSON:", error);
        // Return the raw text so client can handle it
        storyEvent = { raw: generated_text };
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
        type: responseType,
        storyEvent 
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
