import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// API endpoints
const JIKAN_API = "https://api.jikan.moe/v4";
const ANILIST_API = "https://graphql.anilist.co";
const ANIMECHAN_API = "https://animechan.io/api/v1";
const WAIFU_PICS_API = "https://api.waifu.pics";
const TRACE_MOE_API = "https://api.trace.moe";

// Helper function to fetch from Jikan API (MAL)
async function searchAnimeJikan(query: string): Promise<any> {
  try {
    const response = await fetch(`${JIKAN_API}/anime?q=${encodeURIComponent(query)}&limit=5&sfw=true`);
    if (!response.ok) throw new Error("Jikan API error");
    return await response.json();
  } catch (error) {
    console.error("Jikan API error:", error);
    return null;
  }
}

async function getAnimeByIdJikan(id: number): Promise<any> {
  try {
    const response = await fetch(`${JIKAN_API}/anime/${id}/full`);
    if (!response.ok) throw new Error("Jikan API error");
    return await response.json();
  } catch (error) {
    console.error("Jikan API error:", error);
    return null;
  }
}

async function searchMangaJikan(query: string): Promise<any> {
  try {
    const response = await fetch(`${JIKAN_API}/manga?q=${encodeURIComponent(query)}&limit=5&sfw=true`);
    if (!response.ok) throw new Error("Jikan API error");
    return await response.json();
  } catch (error) {
    console.error("Jikan API error:", error);
    return null;
  }
}

async function searchCharacterJikan(query: string): Promise<any> {
  try {
    const response = await fetch(`${JIKAN_API}/characters?q=${encodeURIComponent(query)}&limit=5`);
    if (!response.ok) throw new Error("Jikan API error");
    return await response.json();
  } catch (error) {
    console.error("Jikan API error:", error);
    return null;
  }
}

async function getTopAnimeJikan(filter: string = "airing"): Promise<any> {
  try {
    const response = await fetch(`${JIKAN_API}/top/anime?filter=${filter}&limit=10`);
    if (!response.ok) throw new Error("Jikan API error");
    return await response.json();
  } catch (error) {
    console.error("Jikan API error:", error);
    return null;
  }
}

async function getSeasonNowJikan(): Promise<any> {
  try {
    const response = await fetch(`${JIKAN_API}/seasons/now?limit=10`);
    if (!response.ok) throw new Error("Jikan API error");
    return await response.json();
  } catch (error) {
    console.error("Jikan API error:", error);
    return null;
  }
}

async function getAnimeRecommendationsJikan(id: number): Promise<any> {
  try {
    const response = await fetch(`${JIKAN_API}/anime/${id}/recommendations`);
    if (!response.ok) throw new Error("Jikan API error");
    return await response.json();
  } catch (error) {
    console.error("Jikan API error:", error);
    return null;
  }
}

// AniList GraphQL API
async function searchAniList(query: string, type: string = "ANIME"): Promise<any> {
  const graphqlQuery = `
    query ($search: String, $type: MediaType) {
      Page(perPage: 5) {
        media(search: $search, type: $type) {
          id
          title {
            romaji
            english
            native
          }
          description
          episodes
          chapters
          status
          averageScore
          popularity
          genres
          coverImage {
            large
          }
          startDate {
            year
            month
            day
          }
          endDate {
            year
            month
            day
          }
          studios(isMain: true) {
            nodes {
              name
            }
          }
          staff(perPage: 5) {
            nodes {
              name {
                full
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(ANILIST_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: graphqlQuery,
        variables: { search: query, type },
      }),
    });
    if (!response.ok) throw new Error("AniList API error");
    return await response.json();
  } catch (error) {
    console.error("AniList API error:", error);
    return null;
  }
}

// AnimeChan API for quotes
async function getAnimeQuote(anime?: string): Promise<any> {
  try {
    const url = anime 
      ? `${ANIMECHAN_API}/quotes?anime=${encodeURIComponent(anime)}&page=1` 
      : `${ANIMECHAN_API}/quotes/random`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("AnimeChan API error");
    return await response.json();
  } catch (error) {
    console.error("AnimeChan API error:", error);
    return null;
  }
}

// Waifu.pics API
async function getWaifuImage(category: string = "waifu"): Promise<any> {
  try {
    const response = await fetch(`${WAIFU_PICS_API}/sfw/${category}`);
    if (!response.ok) throw new Error("Waifu.pics API error");
    return await response.json();
  } catch (error) {
    console.error("Waifu.pics API error:", error);
    return null;
  }
}

// Determine user intent and fetch relevant data
async function processUserQuery(query: string): Promise<{ intent: string; data: any; context: string }> {
  const lowerQuery = query.toLowerCase();
  
  // Detect intent patterns
  const patterns = {
    searchAnime: /(?:search|find|look for|what is|tell me about|info on|information about)\s*(?:the\s+)?(?:anime\s+)?(.+)/i,
    searchManga: /(?:manga|manhwa|manhua)\s*(?:called|named|about)?\s*(.+)/i,
    searchCharacter: /(?:character|who is|tell me about character)\s*(.+)/i,
    topAnime: /(?:top|best|popular|highest rated)\s*(?:anime|shows)/i,
    currentSeason: /(?:current|this)\s*season|(?:airing|releasing)\s*(?:now|anime)|what's airing/i,
    recommendations: /(?:recommend|similar to|like)\s*(.+)/i,
    quote: /(?:quote|quotes|say|said)\s*(?:from|in|by)?\s*(.+)?/i,
    waifuImage: /(?:waifu|anime girl|picture|image)\s*(?:of)?\s*(.+)?/i,
    upcomingAnime: /(?:upcoming|future|next season)\s*(?:anime|shows)/i,
    animeNews: /(?:news|latest|recent)\s*(?:anime|updates)/i,
    genre: /(?:anime|shows)\s*(?:in|with|of)\s*(?:genre|category)?\s*(.+)/i,
  };

  let intent = "general";
  let data: any = {};
  let context = "";

  // Check for search anime intent
  if (patterns.topAnime.test(lowerQuery)) {
    intent = "topAnime";
    const result = await getTopAnimeJikan("bypopularity");
    if (result?.data) {
      data = result.data;
      context = `Top anime list with ${data.length} results`;
    }
  } else if (patterns.currentSeason.test(lowerQuery)) {
    intent = "currentSeason";
    const result = await getSeasonNowJikan();
    if (result?.data) {
      data = result.data;
      context = `Currently airing anime this season`;
    }
  } else if (patterns.upcomingAnime.test(lowerQuery)) {
    intent = "upcomingAnime";
    const result = await getTopAnimeJikan("upcoming");
    if (result?.data) {
      data = result.data;
      context = `Upcoming anime releases`;
    }
  } else if (patterns.searchManga.test(lowerQuery)) {
    intent = "searchManga";
    const match = lowerQuery.match(patterns.searchManga);
    const searchTerm = match?.[1]?.trim() || query;
    const [jikanResult, anilistResult] = await Promise.all([
      searchMangaJikan(searchTerm),
      searchAniList(searchTerm, "MANGA"),
    ]);
    data = { jikan: jikanResult?.data, anilist: anilistResult?.data?.Page?.media };
    context = `Manga search results for "${searchTerm}"`;
  } else if (patterns.searchCharacter.test(lowerQuery)) {
    intent = "searchCharacter";
    const match = lowerQuery.match(patterns.searchCharacter);
    const searchTerm = match?.[1]?.trim() || query;
    const result = await searchCharacterJikan(searchTerm);
    data = result?.data;
    context = `Character search results for "${searchTerm}"`;
  } else if (patterns.recommendations.test(lowerQuery)) {
    intent = "recommendations";
    const match = lowerQuery.match(patterns.recommendations);
    const searchTerm = match?.[1]?.trim() || "";
    // First find the anime
    const searchResult = await searchAnimeJikan(searchTerm);
    if (searchResult?.data?.[0]) {
      const animeId = searchResult.data[0].mal_id;
      const recommendations = await getAnimeRecommendationsJikan(animeId);
      data = { 
        originalAnime: searchResult.data[0], 
        recommendations: recommendations?.data?.slice(0, 5) 
      };
      context = `Recommendations similar to "${searchResult.data[0].title}"`;
    }
  } else if (patterns.quote.test(lowerQuery)) {
    intent = "quote";
    const match = lowerQuery.match(patterns.quote);
    const animeName = match?.[1]?.trim();
    const result = await getAnimeQuote(animeName);
    data = result;
    context = animeName ? `Quote from "${animeName}"` : "Random anime quote";
  } else if (patterns.waifuImage.test(lowerQuery)) {
    intent = "waifuImage";
    const categories = ["waifu", "neko", "shinobu", "megumin", "bully", "cuddle", "hug", "pat", "smile", "happy"];
    let category = "waifu";
    for (const cat of categories) {
      if (lowerQuery.includes(cat)) {
        category = cat;
        break;
      }
    }
    const result = await getWaifuImage(category);
    data = result;
    context = `Anime ${category} image`;
  } else {
    // Default to anime search
    intent = "searchAnime";
    const searchTerm = query.replace(/(?:anime|search|find|show me|tell me about|info|information)/gi, "").trim() || query;
    const [jikanResult, anilistResult] = await Promise.all([
      searchAnimeJikan(searchTerm),
      searchAniList(searchTerm, "ANIME"),
    ]);
    data = { jikan: jikanResult?.data, anilist: anilistResult?.data?.Page?.media };
    context = `Anime search results for "${searchTerm}"`;
  }

  return { intent, data, context };
}

// Format API data for AI context
function formatDataForAI(intent: string, data: any): string {
  if (!data) return "No data found.";

  switch (intent) {
    case "topAnime":
    case "currentSeason":
    case "upcomingAnime":
      if (Array.isArray(data)) {
        return data.map((anime: any, i: number) => 
          `${i + 1}. ${anime.title} (Score: ${anime.score || 'N/A'}, Episodes: ${anime.episodes || 'N/A'}) - ${anime.synopsis?.slice(0, 150) || 'No description'}...`
        ).join("\n\n");
      }
      break;
    
    case "searchAnime":
    case "searchManga":
      const jikanData = data.jikan || [];
      const anilistData = data.anilist || [];
      let result = "";
      
      if (jikanData.length > 0) {
        result += "From MyAnimeList:\n";
        result += jikanData.slice(0, 3).map((item: any) => 
          `- ${item.title} (${item.type}, Score: ${item.score || 'N/A'})\n  ${item.synopsis?.slice(0, 200) || 'No description'}...`
        ).join("\n\n");
      }
      
      if (anilistData.length > 0) {
        result += "\n\nFrom AniList:\n";
        result += anilistData.slice(0, 3).map((item: any) => 
          `- ${item.title?.english || item.title?.romaji} (Score: ${item.averageScore || 'N/A'}/100)\n  Genres: ${item.genres?.join(", ") || 'N/A'}\n  ${item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || 'No description'}...`
        ).join("\n\n");
      }
      
      return result || "No results found.";
    
    case "searchCharacter":
      if (Array.isArray(data)) {
        return data.map((char: any) => 
          `- ${char.name} (Favorites: ${char.favorites || 0})\n  ${char.about?.slice(0, 200) || 'No description'}...`
        ).join("\n\n");
      }
      break;
    
    case "recommendations":
      if (data.originalAnime && data.recommendations) {
        let result = `Based on "${data.originalAnime.title}":\n\n`;
        result += data.recommendations.map((rec: any, i: number) => 
          `${i + 1}. ${rec.entry?.title} - ${rec.entry?.synopsis?.slice(0, 100) || 'No description'}...`
        ).join("\n\n");
        return result;
      }
      break;
    
    case "quote":
      if (data?.data?.[0]) {
        const quote = data.data[0];
        return `"${quote.content}"\n- ${quote.character?.name || 'Unknown'} from ${quote.anime?.name || 'Unknown Anime'}`;
      } else if (data?.content) {
        return `"${data.content}"\n- ${data.character?.name || 'Unknown'} from ${data.anime?.name || 'Unknown Anime'}`;
      }
      break;
    
    case "waifuImage":
      if (data?.url) {
        return `IMAGE_URL:${data.url}`;
      }
      break;
  }
  
  return JSON.stringify(data).slice(0, 1000);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Get the latest user message
    const userMessage = messages[messages.length - 1]?.content || "";
    
    // Process the query and fetch relevant data
    console.log("Processing user query:", userMessage);
    const { intent, data, context } = await processUserQuery(userMessage);
    console.log("Intent detected:", intent, "Context:", context);
    
    // Format the data for AI
    const formattedData = formatDataForAI(intent, data);
    console.log("Formatted data preview:", formattedData.slice(0, 500));

    // System prompt for the anime AI assistant
    const systemPrompt = `You are Anime-Chan, an enthusiastic and knowledgeable anime AI assistant with a cute personality! 🌸

Your personality:
- You're super excited about anime and love sharing your knowledge
- You use occasional Japanese words like "sugoi!", "kawaii!", "nani?!" naturally
- You're helpful, friendly, and never condescending
- You format your responses beautifully with emojis and clear sections

Your capabilities:
- Search anime and manga from MyAnimeList and AniList databases
- Find character information
- Get anime quotes
- Show top/popular anime lists
- Get current season anime
- Provide recommendations
- Share anime images

IMPORTANT FORMATTING RULES:
1. When showing anime/manga results, format them as nice cards with:
   - Title (with Japanese name if available)
   - Score/Rating
   - Episodes/Chapters count
   - Brief synopsis
   - Genres
   
2. When showing images, always include the URL in this exact format:
   [ANIME_IMAGE](image_url_here)
   
3. Use emojis to make responses engaging: 🎬 🌟 📺 💫 🎭 📚 ❤️ ✨

4. Keep responses concise but informative
5. If data is incomplete, acknowledge it and provide what you can
6. Always be accurate with the data provided - don't make up information

Current query context: ${context}

Here is the real data from anime APIs to use in your response:
${formattedData}

Remember: Use ONLY the data provided above. Do not invent scores, episode counts, or other details. If the data shows "N/A" or is missing, acknowledge it.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("anime-chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
