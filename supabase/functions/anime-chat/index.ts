import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ============================================
// API ENDPOINTS - Comprehensive Anime APIs
// ============================================

// 🔥 ANIME INFO & DATABASE APIs
const JIKAN_API = "https://api.jikan.moe/v4"; // MyAnimeList unofficial
const ANILIST_API = "https://graphql.anilist.co";
const KITSU_API = "https://kitsu.io/api/edge";
const ANIMECHAN_API = "https://animechan.io/api/v1";

// 📚 MANGA & MANHWA APIs
const MANGADEX_API = "https://api.mangadex.org";

// 🔧 TOOLS, UTILITY & AI-RELATED APIs
const WAIFU_PICS_API = "https://api.waifu.pics";
const WAIFU_IM_API = "https://api.waifu.im";
const TRACE_MOE_API = "https://api.trace.moe";
const NEKOS_API = "https://nekos.best/api/v2";

// 🎮 ANIME GAMES & VN APIs
const VNDB_API = "https://api.vndb.org/kana";

// 🎶 ANIME MUSIC APIs
const ANIMETHEMES_API = "https://api.animethemes.moe";

// ============================================
// JIKAN API (MyAnimeList) Functions
// ============================================

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

async function searchVoiceActorJikan(query: string): Promise<any> {
  try {
    const response = await fetch(`${JIKAN_API}/people?q=${encodeURIComponent(query)}&limit=5`);
    if (!response.ok) throw new Error("Jikan API error");
    return await response.json();
  } catch (error) {
    console.error("Jikan API error:", error);
    return null;
  }
}

async function getAnimeGenresJikan(): Promise<any> {
  try {
    const response = await fetch(`${JIKAN_API}/genres/anime`);
    if (!response.ok) throw new Error("Jikan API error");
    return await response.json();
  } catch (error) {
    console.error("Jikan API error:", error);
    return null;
  }
}

async function searchAnimeByGenreJikan(genreId: number): Promise<any> {
  try {
    const response = await fetch(`${JIKAN_API}/anime?genres=${genreId}&limit=10&order_by=score&sort=desc`);
    if (!response.ok) throw new Error("Jikan API error");
    return await response.json();
  } catch (error) {
    console.error("Jikan API error:", error);
    return null;
  }
}

async function getAnimeScheduleJikan(day?: string): Promise<any> {
  try {
    const url = day ? `${JIKAN_API}/schedules?filter=${day}` : `${JIKAN_API}/schedules`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Jikan API error");
    return await response.json();
  } catch (error) {
    console.error("Jikan API error:", error);
    return null;
  }
}

async function getRandomAnimeJikan(): Promise<any> {
  try {
    const response = await fetch(`${JIKAN_API}/random/anime`);
    if (!response.ok) throw new Error("Jikan API error");
    return await response.json();
  } catch (error) {
    console.error("Jikan API error:", error);
    return null;
  }
}

async function getAnimeReviewsJikan(id: number): Promise<any> {
  try {
    const response = await fetch(`${JIKAN_API}/anime/${id}/reviews`);
    if (!response.ok) throw new Error("Jikan API error");
    return await response.json();
  } catch (error) {
    console.error("Jikan API error:", error);
    return null;
  }
}

async function getAnimeStaffJikan(id: number): Promise<any> {
  try {
    const response = await fetch(`${JIKAN_API}/anime/${id}/staff`);
    if (!response.ok) throw new Error("Jikan API error");
    return await response.json();
  } catch (error) {
    console.error("Jikan API error:", error);
    return null;
  }
}

// ============================================
// ANILIST GraphQL API Functions
// ============================================

async function searchAniList(query: string, type: string = "ANIME"): Promise<any> {
  const graphqlQuery = `
    query ($search: String, $type: MediaType) {
      Page(perPage: 5) {
        media(search: $search, type: $type) {
          id
          title { romaji english native }
          description
          episodes
          chapters
          volumes
          status
          averageScore
          popularity
          genres
          tags { name rank }
          coverImage { large }
          bannerImage
          startDate { year month day }
          endDate { year month day }
          season
          seasonYear
          format
          source
          studios(isMain: true) { nodes { name } }
          staff(perPage: 5) { nodes { name { full } } }
          characters(perPage: 5) { nodes { name { full } } }
          relations { edges { node { title { romaji } } relationType } }
          trailer { id site }
          externalLinks { url site }
        }
      }
    }
  `;

  try {
    const response = await fetch(ANILIST_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: graphqlQuery, variables: { search: query, type } }),
    });
    if (!response.ok) throw new Error("AniList API error");
    return await response.json();
  } catch (error) {
    console.error("AniList API error:", error);
    return null;
  }
}

async function getTrendingAniList(): Promise<any> {
  const graphqlQuery = `
    query {
      Page(perPage: 10) {
        media(type: ANIME, sort: TRENDING_DESC) {
          id
          title { romaji english }
          averageScore
          popularity
          episodes
          status
          genres
          coverImage { large }
          description
        }
      }
    }
  `;

  try {
    const response = await fetch(ANILIST_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: graphqlQuery }),
    });
    if (!response.ok) throw new Error("AniList API error");
    return await response.json();
  } catch (error) {
    console.error("AniList API error:", error);
    return null;
  }
}

async function getPopularAniList(type: string = "ANIME"): Promise<any> {
  const graphqlQuery = `
    query ($type: MediaType) {
      Page(perPage: 10) {
        media(type: $type, sort: POPULARITY_DESC) {
          id
          title { romaji english }
          averageScore
          popularity
          episodes
          chapters
          status
          genres
          coverImage { large }
          description
        }
      }
    }
  `;

  try {
    const response = await fetch(ANILIST_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: graphqlQuery, variables: { type } }),
    });
    if (!response.ok) throw new Error("AniList API error");
    return await response.json();
  } catch (error) {
    console.error("AniList API error:", error);
    return null;
  }
}

async function getAiringScheduleAniList(): Promise<any> {
  const now = Math.floor(Date.now() / 1000);
  const weekFromNow = now + 7 * 24 * 60 * 60;
  
  const graphqlQuery = `
    query ($airingAt_greater: Int, $airingAt_lesser: Int) {
      Page(perPage: 20) {
        airingSchedules(airingAt_greater: $airingAt_greater, airingAt_lesser: $airingAt_lesser, sort: TIME) {
          airingAt
          episode
          media {
            title { romaji english }
            coverImage { large }
            episodes
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
        variables: { airingAt_greater: now, airingAt_lesser: weekFromNow } 
      }),
    });
    if (!response.ok) throw new Error("AniList API error");
    return await response.json();
  } catch (error) {
    console.error("AniList API error:", error);
    return null;
  }
}

async function searchStudioAniList(query: string): Promise<any> {
  const graphqlQuery = `
    query ($search: String) {
      Page(perPage: 5) {
        studios(search: $search) {
          id
          name
          isAnimationStudio
          favourites
          media(sort: POPULARITY_DESC, perPage: 5) {
            nodes {
              title { romaji english }
              averageScore
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
      body: JSON.stringify({ query: graphqlQuery, variables: { search: query } }),
    });
    if (!response.ok) throw new Error("AniList API error");
    return await response.json();
  } catch (error) {
    console.error("AniList API error:", error);
    return null;
  }
}

async function searchStaffAniList(query: string): Promise<any> {
  const graphqlQuery = `
    query ($search: String) {
      Page(perPage: 5) {
        staff(search: $search) {
          id
          name { full native }
          description
          primaryOccupations
          favourites
          image { large }
          staffMedia(perPage: 5) {
            nodes {
              title { romaji english }
            }
          }
          characters(perPage: 5) {
            nodes {
              name { full }
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
      body: JSON.stringify({ query: graphqlQuery, variables: { search: query } }),
    });
    if (!response.ok) throw new Error("AniList API error");
    return await response.json();
  } catch (error) {
    console.error("AniList API error:", error);
    return null;
  }
}

// ============================================
// KITSU API Functions
// ============================================

async function searchKitsu(query: string, type: string = "anime"): Promise<any> {
  try {
    const response = await fetch(
      `${KITSU_API}/${type}?filter[text]=${encodeURIComponent(query)}&page[limit]=5`
    );
    if (!response.ok) throw new Error("Kitsu API error");
    return await response.json();
  } catch (error) {
    console.error("Kitsu API error:", error);
    return null;
  }
}

async function getTrendingKitsu(type: string = "anime"): Promise<any> {
  try {
    const response = await fetch(`${KITSU_API}/trending/${type}?limit=10`);
    if (!response.ok) throw new Error("Kitsu API error");
    return await response.json();
  } catch (error) {
    console.error("Kitsu API error:", error);
    return null;
  }
}

async function getKitsuCategories(): Promise<any> {
  try {
    const response = await fetch(`${KITSU_API}/categories?page[limit]=20&sort=-totalMediaCount`);
    if (!response.ok) throw new Error("Kitsu API error");
    return await response.json();
  } catch (error) {
    console.error("Kitsu API error:", error);
    return null;
  }
}

// ============================================
// MANGADEX API Functions
// ============================================

async function searchMangaDex(query: string): Promise<any> {
  try {
    const response = await fetch(
      `${MANGADEX_API}/manga?title=${encodeURIComponent(query)}&limit=5&includes[]=cover_art&includes[]=author&contentRating[]=safe&contentRating[]=suggestive`
    );
    if (!response.ok) throw new Error("MangaDex API error");
    return await response.json();
  } catch (error) {
    console.error("MangaDex API error:", error);
    return null;
  }
}

async function getLatestMangaDex(): Promise<any> {
  try {
    const response = await fetch(
      `${MANGADEX_API}/manga?limit=10&includes[]=cover_art&order[latestUploadedChapter]=desc&contentRating[]=safe`
    );
    if (!response.ok) throw new Error("MangaDex API error");
    return await response.json();
  } catch (error) {
    console.error("MangaDex API error:", error);
    return null;
  }
}

async function getPopularMangaDex(): Promise<any> {
  try {
    const response = await fetch(
      `${MANGADEX_API}/manga?limit=10&includes[]=cover_art&order[followedCount]=desc&contentRating[]=safe`
    );
    if (!response.ok) throw new Error("MangaDex API error");
    return await response.json();
  } catch (error) {
    console.error("MangaDex API error:", error);
    return null;
  }
}

// ============================================
// ANIMECHAN API Functions (Quotes)
// ============================================

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

async function getQuotesByCharacter(character: string): Promise<any> {
  try {
    const response = await fetch(`${ANIMECHAN_API}/quotes?character=${encodeURIComponent(character)}&page=1`);
    if (!response.ok) throw new Error("AnimeChan API error");
    return await response.json();
  } catch (error) {
    console.error("AnimeChan API error:", error);
    return null;
  }
}

// ============================================
// WAIFU PICS API Functions
// ============================================

async function getWaifuPics(category: string = "waifu"): Promise<any> {
  try {
    const response = await fetch(`${WAIFU_PICS_API}/sfw/${category}`);
    if (!response.ok) throw new Error("Waifu.pics API error");
    return await response.json();
  } catch (error) {
    console.error("Waifu.pics API error:", error);
    return null;
  }
}

async function getWaifuPicsMany(category: string = "waifu"): Promise<any> {
  try {
    const response = await fetch(`${WAIFU_PICS_API}/many/sfw/${category}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!response.ok) throw new Error("Waifu.pics API error");
    return await response.json();
  } catch (error) {
    console.error("Waifu.pics API error:", error);
    return null;
  }
}

// ============================================
// WAIFU.IM API Functions
// ============================================

async function getWaifuIm(tag: string = "waifu"): Promise<any> {
  try {
    const response = await fetch(`${WAIFU_IM_API}/search?included_tags=${tag}&is_nsfw=false`);
    if (!response.ok) throw new Error("Waifu.im API error");
    return await response.json();
  } catch (error) {
    console.error("Waifu.im API error:", error);
    return null;
  }
}

// ============================================
// NEKOS.BEST API Functions
// ============================================

async function getNekosImage(category: string = "neko"): Promise<any> {
  try {
    const response = await fetch(`${NEKOS_API}/${category}`);
    if (!response.ok) throw new Error("Nekos API error");
    return await response.json();
  } catch (error) {
    console.error("Nekos API error:", error);
    return null;
  }
}

// ============================================
// TRACE.MOE API Functions (Scene Finder)
// ============================================

async function searchSceneTraceMoe(imageUrl: string): Promise<any> {
  try {
    const response = await fetch(`${TRACE_MOE_API}/search?url=${encodeURIComponent(imageUrl)}`);
    if (!response.ok) throw new Error("trace.moe API error");
    return await response.json();
  } catch (error) {
    console.error("trace.moe API error:", error);
    return null;
  }
}

// ============================================
// VNDB API Functions (Visual Novels)
// ============================================

async function searchVNDB(query: string): Promise<any> {
  try {
    const response = await fetch(VNDB_API + "/vn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filters: ["search", "=", query],
        fields: "id, title, titles.title, titles.lang, description, rating, length, released, developers.name, tags.name, image.url",
        results: 5,
      }),
    });
    if (!response.ok) throw new Error("VNDB API error");
    return await response.json();
  } catch (error) {
    console.error("VNDB API error:", error);
    return null;
  }
}

async function getPopularVNDB(): Promise<any> {
  try {
    const response = await fetch(VNDB_API + "/vn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filters: ["rating", ">=", 80],
        fields: "id, title, rating, released, developers.name, image.url",
        sort: "rating",
        reverse: true,
        results: 10,
      }),
    });
    if (!response.ok) throw new Error("VNDB API error");
    return await response.json();
  } catch (error) {
    console.error("VNDB API error:", error);
    return null;
  }
}

// ============================================
// ANIMETHEMES API Functions (Music)
// ============================================

async function searchAnimeThemes(query: string): Promise<any> {
  try {
    const response = await fetch(
      `${ANIMETHEMES_API}/search?fields[search]=anime&include[anime]=animethemes.animethemeentries.videos,animethemes.song.artists&q=${encodeURIComponent(query)}`
    );
    if (!response.ok) throw new Error("AnimeThemes API error");
    return await response.json();
  } catch (error) {
    console.error("AnimeThemes API error:", error);
    return null;
  }
}

// ============================================
// GENRE MAPPING
// ============================================

const genreMap: Record<string, number> = {
  action: 1, adventure: 2, avant_garde: 5, award_winning: 46, boys_love: 28,
  comedy: 4, drama: 8, fantasy: 10, girls_love: 26, gourmet: 47,
  horror: 14, mystery: 7, romance: 22, sci_fi: 24, slice_of_life: 36,
  sports: 30, supernatural: 37, suspense: 41, ecchi: 9, isekai: 62,
  mecha: 18, military: 38, music: 19, parody: 20, psychological: 40,
  school: 23, seinen: 42, shoujo: 25, shounen: 27, space: 29,
  super_power: 31, vampire: 32, harem: 35, martial_arts: 17, samurai: 21,
  demons: 6, game: 11, historical: 13, josei: 43, kids: 15,
  magic: 16, police: 39, thriller: 41
};

// ============================================
// INTENT DETECTION & DATA PROCESSING
// ============================================

async function processUserQuery(query: string): Promise<{ intent: string; data: any; context: string }> {
  const lowerQuery = query.toLowerCase();
  
  // Intent patterns
  const patterns = {
    searchAnime: /(?:search|find|look for|what is|tell me about|info on|information about)\s*(?:the\s+)?(?:anime\s+)?(.+)/i,
    searchManga: /(?:manga|manhwa|manhua)\s*(?:called|named|about)?\s*(.+)/i,
    searchCharacter: /(?:character|who is)\s*(.+)/i,
    searchVoiceActor: /(?:voice actor|seiyuu|va|who voices)\s*(.+)/i,
    searchStudio: /(?:studio|animation studio)\s*(.+)/i,
    searchStaff: /(?:director|creator|author|writer|mangaka)\s*(.+)/i,
    topAnime: /(?:top|best|highest rated)\s*(?:anime|shows)/i,
    popularAnime: /(?:popular|most watched)\s*(?:anime|shows)/i,
    trendingAnime: /(?:trending|hot|viral)\s*(?:anime|shows)/i,
    currentSeason: /(?:current|this)\s*season|(?:airing|releasing)\s*(?:now|anime)|what's airing/i,
    upcomingAnime: /(?:upcoming|future|next season)\s*(?:anime|shows)/i,
    recommendations: /(?:recommend|similar to|like)\s*(.+)/i,
    quote: /(?:quote|quotes|say|said)\s*(?:from|in|by)?\s*(.+)?/i,
    waifuImage: /(?:waifu|anime girl|neko|picture|image|show me)\s*(?:of)?\s*(.+)?/i,
    schedule: /(?:schedule|when|airing schedule|what airs)\s*(?:today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)?/i,
    randomAnime: /(?:random|surprise me|pick an|give me a random)\s*(?:anime)?/i,
    genre: /(?:anime|shows)\s*(?:in|with|of)\s*(?:genre|category)?\s*(.+)/i,
    visualNovel: /(?:visual novel|vn|eroge|otome)\s*(.+)?/i,
    animeMusic: /(?:opening|ending|op|ed|ost|theme|music)\s*(?:of|from|for)?\s*(.+)?/i,
    sceneFinder: /(?:what anime is this|find anime|scene from|identify anime|trace)/i,
    latestManga: /(?:latest|new|recent)\s*(?:manga|chapters)/i,
    popularManga: /(?:popular|best|top)\s*(?:manga|manhwa)/i,
    airingToday: /(?:airing|releasing|coming out)\s*(?:today|tonight)/i,
  };

  let intent = "general";
  let data: any = {};
  let context = "";

  // Check intents in priority order
  if (patterns.randomAnime.test(lowerQuery)) {
    intent = "randomAnime";
    const result = await getRandomAnimeJikan();
    if (result?.data) {
      data = result.data;
      context = `Random anime recommendation`;
    }
  } else if (patterns.trendingAnime.test(lowerQuery)) {
    intent = "trendingAnime";
    const [anilistResult, kitsuResult] = await Promise.all([
      getTrendingAniList(),
      getTrendingKitsu(),
    ]);
    data = { anilist: anilistResult?.data?.Page?.media, kitsu: kitsuResult?.data };
    context = `Trending anime right now`;
  } else if (patterns.topAnime.test(lowerQuery)) {
    intent = "topAnime";
    const result = await getTopAnimeJikan("bypopularity");
    if (result?.data) {
      data = result.data;
      context = `Top rated anime of all time`;
    }
  } else if (patterns.popularAnime.test(lowerQuery)) {
    intent = "popularAnime";
    const [jikanResult, anilistResult] = await Promise.all([
      getTopAnimeJikan("bypopularity"),
      getPopularAniList("ANIME"),
    ]);
    data = { jikan: jikanResult?.data, anilist: anilistResult?.data?.Page?.media };
    context = `Most popular anime`;
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
  } else if (patterns.schedule.test(lowerQuery)) {
    intent = "schedule";
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    let day = days.find(d => lowerQuery.includes(d));
    if (lowerQuery.includes("today")) {
      const dayIndex = new Date().getDay();
      day = days[(dayIndex + 6) % 7]; // Adjust for Monday = 0
    }
    const result = await getAnimeScheduleJikan(day);
    if (result?.data) {
      data = result.data;
      context = day ? `Anime airing on ${day}` : `Weekly anime schedule`;
    }
  } else if (patterns.latestManga.test(lowerQuery)) {
    intent = "latestManga";
    const result = await getLatestMangaDex();
    if (result?.data) {
      data = result.data;
      context = `Latest manga updates from MangaDex`;
    }
  } else if (patterns.popularManga.test(lowerQuery)) {
    intent = "popularManga";
    const [mangadexResult, anilistResult] = await Promise.all([
      getPopularMangaDex(),
      getPopularAniList("MANGA"),
    ]);
    data = { mangadex: mangadexResult?.data, anilist: anilistResult?.data?.Page?.media };
    context = `Popular manga right now`;
  } else if (patterns.searchManga.test(lowerQuery)) {
    intent = "searchManga";
    const match = lowerQuery.match(patterns.searchManga);
    const searchTerm = match?.[1]?.trim() || query;
    const [jikanResult, anilistResult, mangadexResult] = await Promise.all([
      searchMangaJikan(searchTerm),
      searchAniList(searchTerm, "MANGA"),
      searchMangaDex(searchTerm),
    ]);
    data = { 
      jikan: jikanResult?.data, 
      anilist: anilistResult?.data?.Page?.media,
      mangadex: mangadexResult?.data 
    };
    context = `Manga search results for "${searchTerm}"`;
  } else if (patterns.searchVoiceActor.test(lowerQuery)) {
    intent = "searchVoiceActor";
    const match = lowerQuery.match(patterns.searchVoiceActor);
    const searchTerm = match?.[1]?.trim() || query;
    const [jikanResult, anilistResult] = await Promise.all([
      searchVoiceActorJikan(searchTerm),
      searchStaffAniList(searchTerm),
    ]);
    data = { jikan: jikanResult?.data, anilist: anilistResult?.data?.Page?.staff };
    context = `Voice actor/staff search results for "${searchTerm}"`;
  } else if (patterns.searchStudio.test(lowerQuery)) {
    intent = "searchStudio";
    const match = lowerQuery.match(patterns.searchStudio);
    const searchTerm = match?.[1]?.trim() || query;
    const result = await searchStudioAniList(searchTerm);
    data = result?.data?.Page?.studios;
    context = `Studio search results for "${searchTerm}"`;
  } else if (patterns.searchCharacter.test(lowerQuery)) {
    intent = "searchCharacter";
    const match = lowerQuery.match(patterns.searchCharacter);
    const searchTerm = match?.[1]?.trim() || query;
    const result = await searchCharacterJikan(searchTerm);
    data = result?.data;
    context = `Character search results for "${searchTerm}"`;
  } else if (patterns.visualNovel.test(lowerQuery)) {
    intent = "visualNovel";
    const match = lowerQuery.match(patterns.visualNovel);
    const searchTerm = match?.[1]?.trim();
    if (searchTerm) {
      const result = await searchVNDB(searchTerm);
      data = result?.results;
      context = `Visual novel search results for "${searchTerm}"`;
    } else {
      const result = await getPopularVNDB();
      data = result?.results;
      context = `Top rated visual novels`;
    }
  } else if (patterns.animeMusic.test(lowerQuery)) {
    intent = "animeMusic";
    const match = lowerQuery.match(patterns.animeMusic);
    const searchTerm = match?.[1]?.trim() || query.replace(/(?:opening|ending|op|ed|ost|theme|music|of|from|for)/gi, "").trim();
    if (searchTerm) {
      const result = await searchAnimeThemes(searchTerm);
      data = result?.search?.anime;
      context = `Anime music/themes for "${searchTerm}"`;
    }
  } else if (patterns.recommendations.test(lowerQuery)) {
    intent = "recommendations";
    const match = lowerQuery.match(patterns.recommendations);
    const searchTerm = match?.[1]?.trim() || "";
    const searchResult = await searchAnimeJikan(searchTerm);
    if (searchResult?.data?.[0]) {
      const animeId = searchResult.data[0].mal_id;
      const recommendations = await getAnimeRecommendationsJikan(animeId);
      data = { 
        originalAnime: searchResult.data[0], 
        recommendations: recommendations?.data?.slice(0, 8) 
      };
      context = `Recommendations similar to "${searchResult.data[0].title}"`;
    }
  } else if (patterns.genre.test(lowerQuery)) {
    intent = "genre";
    const match = lowerQuery.match(patterns.genre);
    const genreName = match?.[1]?.trim().toLowerCase().replace(/\s+/g, "_");
    const genreId = genreMap[genreName || "action"] || 1;
    const result = await searchAnimeByGenreJikan(genreId);
    data = result?.data;
    context = `Top ${genreName?.replace(/_/g, " ")} anime`;
  } else if (patterns.quote.test(lowerQuery)) {
    intent = "quote";
    const match = lowerQuery.match(patterns.quote);
    const animeName = match?.[1]?.trim();
    const result = await getAnimeQuote(animeName);
    data = result;
    context = animeName ? `Quote from "${animeName}"` : "Random anime quote";
  } else if (patterns.waifuImage.test(lowerQuery)) {
    intent = "waifuImage";
    const categories = ["waifu", "neko", "shinobu", "megumin", "bully", "cuddle", "hug", "pat", "smile", "happy", "wave", "highfive", "handhold", "nom", "bite", "slap", "kick", "kiss", "blush", "cry", "pout", "dance"];
    let category = "waifu";
    for (const cat of categories) {
      if (lowerQuery.includes(cat)) {
        category = cat;
        break;
      }
    }
    // Get from multiple sources
    const [waifuPicsResult, nekosResult] = await Promise.all([
      getWaifuPics(category),
      getNekosImage(categories.includes(category) ? category : "neko"),
    ]);
    data = { waifuPics: waifuPicsResult, nekos: nekosResult };
    context = `Anime ${category} images`;
  } else {
    // Default to comprehensive anime search
    intent = "searchAnime";
    const searchTerm = query.replace(/(?:anime|search|find|show me|tell me about|info|information)/gi, "").trim() || query;
    const [jikanResult, anilistResult, kitsuResult] = await Promise.all([
      searchAnimeJikan(searchTerm),
      searchAniList(searchTerm, "ANIME"),
      searchKitsu(searchTerm, "anime"),
    ]);
    data = { 
      jikan: jikanResult?.data, 
      anilist: anilistResult?.data?.Page?.media,
      kitsu: kitsuResult?.data
    };
    context = `Anime search results for "${searchTerm}"`;
  }

  return { intent, data, context };
}

// ============================================
// FORMAT DATA FOR AI RESPONSE
// ============================================

function formatDataForAI(intent: string, data: any): string {
  if (!data) return "No data found.";

  switch (intent) {
    case "topAnime":
    case "currentSeason":
    case "upcomingAnime":
    case "schedule":
      if (Array.isArray(data)) {
        return data.slice(0, 10).map((anime: any, i: number) => 
          `${i + 1}. **${anime.title}** (Score: ${anime.score || 'N/A'}, Episodes: ${anime.episodes || '?'}, Status: ${anime.status || 'N/A'})\n   Genres: ${anime.genres?.map((g: any) => g.name).join(", ") || 'N/A'}\n   ${anime.synopsis?.slice(0, 200) || 'No description'}...`
        ).join("\n\n");
      }
      break;
    
    case "trendingAnime":
    case "popularAnime":
      let trendingResult = "";
      if (data.anilist?.length > 0) {
        trendingResult += "**From AniList:**\n";
        trendingResult += data.anilist.slice(0, 5).map((item: any, i: number) => 
          `${i + 1}. **${item.title?.english || item.title?.romaji}** (Score: ${item.averageScore || 'N/A'}/100, Popularity: ${item.popularity?.toLocaleString() || 'N/A'})\n   Genres: ${item.genres?.join(", ") || 'N/A'}\n   ${item.description?.replace(/<[^>]*>/g, '').slice(0, 150) || 'No description'}...`
        ).join("\n\n");
      }
      if (data.kitsu?.length > 0) {
        trendingResult += "\n\n**From Kitsu:**\n";
        trendingResult += data.kitsu.slice(0, 5).map((item: any, i: number) => 
          `${i + 1}. **${item.attributes?.canonicalTitle}** (Rating: ${item.attributes?.averageRating || 'N/A'}%)\n   ${item.attributes?.synopsis?.slice(0, 150) || 'No description'}...`
        ).join("\n\n");
      }
      return trendingResult || "No trending anime found.";
    
    case "searchAnime":
      let searchResult = "";
      if (data.jikan?.length > 0) {
        searchResult += "**From MyAnimeList (Jikan):**\n";
        searchResult += data.jikan.slice(0, 3).map((item: any) => 
          `- **${item.title}** (${item.type}, Score: ${item.score || 'N/A'}, Episodes: ${item.episodes || '?'})\n  Aired: ${item.aired?.string || 'N/A'}\n  Genres: ${item.genres?.map((g: any) => g.name).join(", ") || 'N/A'}\n  ${item.synopsis?.slice(0, 200) || 'No description'}...`
        ).join("\n\n");
      }
      if (data.anilist?.length > 0) {
        searchResult += "\n\n**From AniList:**\n";
        searchResult += data.anilist.slice(0, 3).map((item: any) => 
          `- **${item.title?.english || item.title?.romaji}** (Score: ${item.averageScore || 'N/A'}/100)\n  Status: ${item.status || 'N/A'}, Episodes: ${item.episodes || '?'}\n  Genres: ${item.genres?.join(", ") || 'N/A'}\n  Studios: ${item.studios?.nodes?.map((s: any) => s.name).join(", ") || 'N/A'}\n  ${item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || 'No description'}...`
        ).join("\n\n");
      }
      if (data.kitsu?.length > 0) {
        searchResult += "\n\n**From Kitsu:**\n";
        searchResult += data.kitsu.slice(0, 2).map((item: any) => 
          `- **${item.attributes?.canonicalTitle}** (Rating: ${item.attributes?.averageRating || 'N/A'}%)\n  Episodes: ${item.attributes?.episodeCount || '?'}, Status: ${item.attributes?.status || 'N/A'}\n  ${item.attributes?.synopsis?.slice(0, 150) || 'No description'}...`
        ).join("\n\n");
      }
      return searchResult || "No results found.";

    case "searchManga":
    case "latestManga":
    case "popularManga":
      let mangaResult = "";
      if (data.jikan?.length > 0) {
        mangaResult += "**From MyAnimeList:**\n";
        mangaResult += data.jikan.slice(0, 3).map((item: any) => 
          `- **${item.title}** (${item.type}, Score: ${item.score || 'N/A'})\n  Chapters: ${item.chapters || '?'}, Volumes: ${item.volumes || '?'}\n  ${item.synopsis?.slice(0, 150) || 'No description'}...`
        ).join("\n\n");
      }
      if (data.anilist?.length > 0) {
        mangaResult += "\n\n**From AniList:**\n";
        mangaResult += data.anilist.slice(0, 3).map((item: any) => 
          `- **${item.title?.english || item.title?.romaji}** (Score: ${item.averageScore || 'N/A'}/100)\n  Chapters: ${item.chapters || '?'}, Status: ${item.status || 'N/A'}\n  ${item.description?.replace(/<[^>]*>/g, '').slice(0, 150) || 'No description'}...`
        ).join("\n\n");
      }
      if (data.mangadex?.length > 0) {
        mangaResult += "\n\n**From MangaDex:**\n";
        mangaResult += data.mangadex.slice(0, 3).map((item: any) => {
          const title = item.attributes?.title?.en || Object.values(item.attributes?.title || {})[0] || 'Unknown';
          return `- **${title}** (Status: ${item.attributes?.status || 'N/A'})\n  ${item.attributes?.description?.en?.slice(0, 150) || 'No description'}...`;
        }).join("\n\n");
      }
      return mangaResult || "No manga results found.";
    
    case "searchCharacter":
      if (Array.isArray(data)) {
        return data.map((char: any) => 
          `- **${char.name}** (Favorites: ${char.favorites?.toLocaleString() || 0})\n  ${char.about?.slice(0, 200) || 'No description'}...`
        ).join("\n\n");
      }
      break;

    case "searchVoiceActor":
      let vaResult = "";
      if (data.jikan?.length > 0) {
        vaResult += "**Voice Actors/Staff from MAL:**\n";
        vaResult += data.jikan.slice(0, 5).map((person: any) => 
          `- **${person.name}** (Favorites: ${person.favorites?.toLocaleString() || 0})\n  Birthday: ${person.birthday || 'N/A'}\n  ${person.about?.slice(0, 150) || 'No description'}...`
        ).join("\n\n");
      }
      if (data.anilist?.length > 0) {
        vaResult += "\n\n**From AniList:**\n";
        vaResult += data.anilist.slice(0, 5).map((person: any) => 
          `- **${person.name?.full}** (${person.name?.native || ''})\n  Roles: ${person.primaryOccupations?.join(", ") || 'N/A'}\n  Notable works: ${person.staffMedia?.nodes?.slice(0, 3).map((m: any) => m.title?.romaji).join(", ") || 'N/A'}`
        ).join("\n\n");
      }
      return vaResult || "No voice actors found.";

    case "searchStudio":
      if (Array.isArray(data) && data.length > 0) {
        return data.map((studio: any) => 
          `- **${studio.name}** (Animation Studio: ${studio.isAnimationStudio ? 'Yes' : 'No'}, Favorites: ${studio.favourites?.toLocaleString() || 0})\n  Notable works: ${studio.media?.nodes?.map((m: any) => `${m.title?.romaji} (${m.averageScore || 'N/A'})`).join(", ") || 'N/A'}`
        ).join("\n\n");
      }
      break;

    case "visualNovel":
      if (Array.isArray(data) && data.length > 0) {
        return data.map((vn: any, i: number) => 
          `${i + 1}. **${vn.title}** (Rating: ${vn.rating ? (vn.rating / 10).toFixed(1) : 'N/A'}/10)\n   Released: ${vn.released || 'N/A'}\n   Length: ${vn.length === 1 ? 'Very Short' : vn.length === 2 ? 'Short' : vn.length === 3 ? 'Medium' : vn.length === 4 ? 'Long' : vn.length === 5 ? 'Very Long' : 'N/A'}\n   ${vn.description?.replace(/<[^>]*>/g, '').slice(0, 150) || 'No description'}...`
        ).join("\n\n");
      }
      break;

    case "animeMusic":
      if (Array.isArray(data) && data.length > 0) {
        return data.slice(0, 5).map((anime: any) => {
          const themes = anime.animethemes || [];
          const themeList = themes.slice(0, 5).map((theme: any) => 
            `  - ${theme.slug} "${theme.song?.title || 'Unknown'}" by ${theme.song?.artists?.map((a: any) => a.name).join(", ") || 'Unknown'}`
          ).join("\n");
          return `**${anime.name}**:\n${themeList || 'No themes found'}`;
        }).join("\n\n");
      }
      break;
    
    case "recommendations":
      if (data.originalAnime && data.recommendations) {
        let result = `Based on **"${data.originalAnime.title}"**:\n\n`;
        result += data.recommendations.map((rec: any, i: number) => 
          `${i + 1}. **${rec.entry?.title}** - ${rec.entry?.synopsis?.slice(0, 100) || 'No description'}...`
        ).join("\n\n");
        return result;
      }
      break;
    
    case "randomAnime":
      if (data) {
        return `**${data.title}** (${data.title_japanese || ''})\n\nScore: ${data.score || 'N/A'} | Episodes: ${data.episodes || '?'} | Status: ${data.status || 'N/A'}\n\nGenres: ${data.genres?.map((g: any) => g.name).join(", ") || 'N/A'}\n\nStudios: ${data.studios?.map((s: any) => s.name).join(", ") || 'N/A'}\n\nSynopsis:\n${data.synopsis || 'No description available.'}`;
      }
      break;
    
    case "quote":
      if (data?.data?.[0]) {
        const quote = data.data[0];
        return `"${quote.content}"\n\n— **${quote.character?.name || 'Unknown'}** from *${quote.anime?.name || 'Unknown Anime'}*`;
      } else if (data?.content) {
        return `"${data.content}"\n\n— **${data.character?.name || 'Unknown'}** from *${data.anime?.name || 'Unknown Anime'}*`;
      }
      break;
    
    case "waifuImage":
      const urls: string[] = [];
      if (data.waifuPics?.url) urls.push(data.waifuPics.url);
      if (data.nekos?.results?.[0]?.url) urls.push(data.nekos.results[0].url);
      if (urls.length > 0) {
        return urls.map(url => `IMAGE_URL:${url}`).join("\n");
      }
      break;

    case "genre":
      if (Array.isArray(data)) {
        return data.slice(0, 10).map((anime: any, i: number) => 
          `${i + 1}. **${anime.title}** (Score: ${anime.score || 'N/A'})\n   Episodes: ${anime.episodes || '?'} | ${anime.synopsis?.slice(0, 150) || 'No description'}...`
        ).join("\n\n");
      }
      break;
  }
  
  return JSON.stringify(data).slice(0, 2000);
}

// ============================================
// MAIN SERVER
// ============================================

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

    const userMessage = messages[messages.length - 1]?.content || "";
    
    console.log("Processing user query:", userMessage);
    const { intent, data, context } = await processUserQuery(userMessage);
    console.log("Intent detected:", intent, "Context:", context);
    
    const formattedData = formatDataForAI(intent, data);
    console.log("Formatted data preview:", formattedData.slice(0, 500));

    const systemPrompt = `You are Anime-Chan (アニメちゃん), the ultimate anime AI assistant with access to comprehensive anime databases! 🌸

Your data sources:
- MyAnimeList (via Jikan API)
- AniList (GraphQL API)
- Kitsu
- MangaDex (for manga)
- VNDB (for visual novels)
- AnimeThemes (for music/OST)
- Waifu.pics & Nekos.best (for images)
- AnimeChan (for quotes)

Your personality:
- Super enthusiastic about anime and otaku culture! ✨
- Use occasional Japanese expressions naturally (sugoi!, kawaii!, nani?!, sasuga!)
- Helpful, knowledgeable, and never condescending
- You love discussing anime theories and recommendations

FORMATTING RULES:
1. Use **bold** for anime/manga titles
2. Structure information clearly with sections
3. Include scores, episodes, and genres when available
4. When showing images, format as: [ANIME_IMAGE](url_here)
5. Use emojis to make responses engaging: 🎬 🌟 📺 💫 🎭 📚 ❤️ ✨ 🎮 🎵
6. Be accurate - use ONLY the data provided below
7. If data is missing or shows "N/A", acknowledge it honestly

Current query context: ${context}

REAL DATA FROM ANIME APIs:
${formattedData}

IMPORTANT: Base your response ONLY on the data above. Do not invent scores, episode counts, or other details.`;

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
