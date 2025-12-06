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
const ANIAPI_API = "https://api.aniapi.com/v1";

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

// 🎞️ ANIME MOVIE APIs  
const TMDB_API = "https://api.themoviedb.org/3";

// ============================================
// SPELLING CORRECTION & FUZZY MATCHING
// ============================================

// Common misspellings map for anime terms - Extended with Japanese romanization
const spellingCorrections: Record<string, string> = {
  // Common anime title misspellings
  "narruto": "naruto", "nartuo": "naruto", "naturo": "naruto", "narutoo": "naruto",
  "one peice": "one piece", "onepiece": "one piece", "op": "one piece", "wan piisu": "one piece",
  "atack on titan": "attack on titan", "aot": "attack on titan", "shingeki": "attack on titan", "snk": "attack on titan",
  "demon slyer": "demon slayer", "kimetsu": "demon slayer", "kny": "demon slayer", "kimetu": "demon slayer",
  "my hero academia": "boku no hero academia", "mha": "boku no hero academia", "bnha": "boku no hero academia",
  "jujustu kaisen": "jujutsu kaisen", "jjk": "jujutsu kaisen", "jujutu": "jujutsu kaisen",
  "full metal alchemist": "fullmetal alchemist", "fma": "fullmetal alchemist", "fmab": "fullmetal alchemist brotherhood",
  "death not": "death note", "deathnote": "death note", "dn": "death note",
  "hunterxhunter": "hunter x hunter", "hxh": "hunter x hunter", "hunter hunter": "hunter x hunter",
  "dragonball": "dragon ball", "dbz": "dragon ball z", "dbs": "dragon ball super", "db": "dragon ball",
  "bleech": "bleach", "blech": "bleach", "blich": "bleach",
  "gintma": "gintama", "gintamma": "gintama", "gintam": "gintama",
  "steins gate": "steins;gate", "steinsgate": "steins;gate", "sg": "steins;gate",
  "code geas": "code geass", "codegeass": "code geass", "cg": "code geass",
  "cowboy bebop": "cowboy bebop", "bebop": "cowboy bebop", "cb": "cowboy bebop",
  "evangelion": "neon genesis evangelion", "eva": "neon genesis evangelion", "nge": "neon genesis evangelion",
  "spy x familly": "spy x family", "spyxfamily": "spy x family", "sxf": "spy x family",
  "chainsaw": "chainsaw man", "csm": "chainsaw man", "chainsawman": "chainsaw man",
  "tokyo revenegers": "tokyo revengers", "tr": "tokyo revengers", "tokyorev": "tokyo revengers",
  "vinland": "vinland saga", "vs": "vinland saga",
  "mob phycho": "mob psycho 100", "mob psycho": "mob psycho 100", "mp100": "mob psycho 100",
  "overloard": "overlord", "ovlord": "overlord",
  "re zero": "re:zero", "rezero": "re:zero", "rz": "re:zero",
  "konosuba": "kono subarashii sekai ni shukufuku wo", "konasuba": "kono subarashii sekai ni shukufuku wo",
  "sword art onlien": "sword art online", "sao": "sword art online", "swordartonline": "sword art online",
  "black clover": "black clover", "bc": "black clover", "blakclover": "black clover",
  "fairy tale": "fairy tail", "ft": "fairy tail", "fairytail": "fairy tail",
  "blue lock": "blue lock", "bluelock": "blue lock", "bl": "blue lock",
  "solo leveling": "solo leveling", "sl": "solo leveling", "sololeveling": "solo leveling",
  "frieren": "sousou no frieren", "friren": "sousou no frieren", "friern": "sousou no frieren",
  "oshi no ko": "oshi no ko", "onk": "oshi no ko", "oshinoko": "oshi no ko",
  "bocchi": "bocchi the rock", "bocchi rock": "bocchi the rock",
  "dandadan": "dandadan", "dandan": "dandadan",
  "kaiju": "kaiju no 8", "kaiju 8": "kaiju no 8",
  "mechanical marrie": "mashle", "mashel": "mashle", "masle": "mashle",
  "mushoku": "mushoku tensei", "mushoku tensi": "mushoku tensei", "mt": "mushoku tensei",
  "tensura": "tensei shitara slime datta ken", "slime": "tensei shitara slime datta ken",
  "shield hero": "tate no yuusha no nariagari",
  "kaguya": "kaguya-sama wa kokurasetai", "kaguya sama": "kaguya-sama wa kokurasetai",
  "oregairu": "yahari ore no seishun love comedy wa machigatteiru",
  "bunny girl": "seishun buta yarou", "bunny girl senpai": "seishun buta yarou",
  "quintuplets": "5-toubun no hanayome", "quints": "5-toubun no hanayome",
  "horimiya": "horimiya", "hori miya": "horimiya",
  "rent a girlfriend": "kanojo okarishimasu", "kanokari": "kanojo okarishimasu",
  "spy family": "spy x family",
  
  // Common query misspellings - Extended
  "recomend": "recommend", "reccomend": "recommend", "recomendation": "recommendation", "reccommend": "recommend",
  "populer": "popular", "popolar": "popular", "papular": "popular",
  "tranding": "trending", "trendng": "trending", "trnding": "trending",
  "shedule": "schedule", "schedual": "schedule", "scedule": "schedule",
  "charcter": "character", "charecter": "character", "charactor": "character",
  "episods": "episodes", "epidodes": "episodes", "episde": "episode",
  "mangaa": "manga", "mange": "manga", "mnga": "manga",
  "animie": "anime", "anme": "anime", "animee": "anime", "anima": "anime",
  "seeson": "season", "seasn": "season", "seson": "season",
  "opning": "opening", "openning": "opening", "opeing": "opening",
  "endng": "ending", "eding": "ending", "endig": "ending",
  "soundtrak": "soundtrack", "ost": "soundtrack", "soundrack": "soundtrack",
  "vocie actor": "voice actor", "va": "voice actor", "seiyuu": "voice actor", "seiyu": "voice actor",
  "studoi": "studio", "stduio": "studio",
  "genere": "genre", "genra": "genre", "gener": "genre",
  "raiting": "rating", "ratng": "rating", "raitng": "rating",
  "sinopsis": "synopsis", "synopis": "synopsis", "synapsis": "synopsis",
  "similiar": "similar", "simlar": "similar", "similer": "similar",
  "waht": "what", "whats": "what's", "wht": "what",
  "gime": "give", "gimme": "give me", "giv": "give",
  "tel me": "tell me", "tellme": "tell me", "telme": "tell me",
  "shwo": "show", "shwo me": "show me", "shw": "show",
  "serach": "search", "seach": "search", "sarch": "search",
  "upcomig": "upcoming", "upcomming": "upcoming",
  "realease": "release", "relase": "release", "realese": "release",
  "when is": "when is", "whan": "when", "wehn": "when",
  "nex": "next", "nextt": "next",
  
  // Japanese romanization fixes
  "sensei": "sensei", "sensie": "sensei",
  "kawai": "kawaii", "kawaiii": "kawaii",
  "sugoi": "sugoi", "sugoii": "sugoi",
  "arigato": "arigatou", "arigatoo": "arigatou",
  "ohayou": "ohayou", "ohayo": "ohayou",
  "konnichiha": "konnichiwa", "konichiwa": "konnichiwa",
  "sayonarra": "sayonara", "sayounara": "sayonara",
  "itadakimasu": "itadakimasu", "itadakimas": "itadakimasu",
  "gomenasai": "gomenasai", "gomennasai": "gomenasai",
  "onegai": "onegai", "onegaishimasu": "onegaishimasu",
};

// Japanese to English intent keywords
const japaneseKeywords: Record<string, string> = {
  // Greetings
  "こんにちは": "hello", "konnichiwa": "hello",
  "おはよう": "good morning", "ohayou": "good morning", "ohayo": "good morning",
  "こんばんは": "good evening", "konbanwa": "good evening",
  "やあ": "hey", "やっほー": "hello",
  "おっす": "hey", "ossu": "hey",
  
  // Thanks
  "ありがとう": "thank you", "arigatou": "thank you", "arigatoo": "thank you",
  "ありがとうございます": "thank you very much", "arigatou gozaimasu": "thank you very much",
  "サンキュー": "thanks", "sankyu": "thanks",
  
  // Goodbye
  "さようなら": "goodbye", "sayonara": "goodbye",
  "じゃね": "see ya", "ja ne": "see ya", "jane": "see ya",
  "またね": "see you", "mata ne": "see you", "matane": "see you",
  "バイバイ": "bye bye", "baibai": "bye bye",
  
  // Questions
  "何": "what", "nani": "what",
  "誰": "who", "dare": "who",
  "どこ": "where", "doko": "where",
  "いつ": "when", "itsu": "when",
  "なぜ": "why", "naze": "why", "doushite": "why",
  "どう": "how", "dou": "how",
  
  // Anime related
  "アニメ": "anime",
  "マンガ": "manga", "漫画": "manga",
  "おすすめ": "recommend", "osusume": "recommend",
  "人気": "popular", "ninki": "popular",
  "新作": "new", "shinsaku": "new",
  "今期": "this season", "konki": "this season",
  "来期": "next season", "raiki": "next season",
  "声優": "voice actor", "seiyuu": "voice actor",
  "キャラ": "character", "kyara": "character",
  "キャラクター": "character",
  "スタジオ": "studio", "sutajio": "studio",
  "監督": "director", "kantoku": "director",
  "主題歌": "theme song", "shudaika": "theme song",
  "オープニング": "opening", "opuningu": "opening",
  "エンディング": "ending", "endingu": "ending",
  "放送": "broadcast", "housou": "broadcast",
  "配信": "streaming", "haishin": "streaming",
  
  // Expressions the AI should understand
  "すごい": "amazing", "sugoi": "amazing",
  "かわいい": "cute", "kawaii": "cute",
  "かっこいい": "cool", "kakkoii": "cool",
  "最高": "the best", "saikou": "the best",
  "面白い": "interesting/funny", "omoshiroi": "interesting",
  "好き": "like", "suki": "like",
  "大好き": "love", "daisuki": "love",
  "教えて": "tell me", "oshiete": "tell me",
  "見たい": "want to watch", "mitai": "want to watch",
  "読みたい": "want to read", "yomitai": "want to read",
};

// Levenshtein distance for fuzzy matching
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Correct spelling in query
function correctSpelling(query: string): string {
  let corrected = query.toLowerCase();
  
  // Handle Japanese keywords first
  for (const [jp, en] of Object.entries(japaneseKeywords)) {
    if (corrected.includes(jp.toLowerCase())) {
      corrected = corrected.replace(jp.toLowerCase(), en);
    }
  }
  
  // Direct replacements from map
  for (const [wrong, right] of Object.entries(spellingCorrections)) {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
    corrected = corrected.replace(regex, right);
  }
  
  // Fuzzy match for words not in map (if word looks like a known anime)
  const words = corrected.split(/\s+/);
  const knownAnime = Object.values(spellingCorrections);
  
  const correctedWords = words.map(word => {
    if (word.length < 4) return word;
    for (const known of knownAnime) {
      if (levenshteinDistance(word, known.split(' ')[0]) <= 2) {
        return known.split(' ')[0];
      }
    }
    return word;
  });
  
  return correctedWords.join(' ');
}

// Detect if query contains Japanese
function containsJapanese(query: string): boolean {
  return /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/.test(query);
}

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
      Page(perPage: 8) {
        media(search: $search, type: $type) {
          id
          title { romaji english native userPreferred }
          description(asHtml: false)
          episodes
          chapters
          volumes
          duration
          status
          averageScore
          meanScore
          popularity
          favourites
          trending
          genres
          tags { name rank description isMediaSpoiler }
          coverImage { large extraLarge color }
          bannerImage
          startDate { year month day }
          endDate { year month day }
          season
          seasonYear
          format
          source
          countryOfOrigin
          isAdult
          hashtag
          synonyms
          studios(isMain: true) { nodes { id name isAnimationStudio siteUrl } }
          staff(perPage: 10, sort: RELEVANCE) { 
            edges { 
              role 
              node { name { full native } primaryOccupations } 
            } 
          }
          characters(perPage: 10, sort: ROLE) { 
            edges { 
              role 
              voiceActors(language: JAPANESE) { name { full native } } 
              node { name { full native } } 
            } 
          }
          relations { 
            edges { 
              relationType 
              node { 
                id 
                title { romaji english native } 
                type 
                format 
                status 
                coverImage { medium } 
              } 
            } 
          }
          recommendations(perPage: 5, sort: RATING_DESC) {
            nodes {
              mediaRecommendation {
                title { romaji english }
                averageScore
              }
            }
          }
          stats {
            scoreDistribution { score amount }
            statusDistribution { status amount }
          }
          rankings { rank type context }
          trailer { id site thumbnail }
          externalLinks { url site icon color }
          streamingEpisodes { title thumbnail url site }
          nextAiringEpisode { airingAt timeUntilAiring episode }
          airingSchedule(notYetAired: true, perPage: 5) {
            nodes { airingAt episode timeUntilAiring }
          }
          reviews(perPage: 3, sort: RATING_DESC) {
            nodes { summary rating score user { name } }
          }
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

// Deep search for news, announcements, and recent activity
async function getAniListNews(): Promise<any> {
  const graphqlQuery = `
    query {
      Page(perPage: 15) {
        activities(type: TEXT, sort: ID_DESC) {
          ... on TextActivity {
            id
            text
            createdAt
            user { name avatar { medium } }
          }
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
    console.error("AniList news error:", error);
    return null;
  }
}

// Get detailed character info with voice actors
async function getCharacterDetailAniList(query: string): Promise<any> {
  const graphqlQuery = `
    query ($search: String) {
      Page(perPage: 5) {
        characters(search: $search) {
          id
          name { full native alternative alternativeSpoiler userPreferred }
          image { large }
          description(asHtml: false)
          gender
          dateOfBirth { year month day }
          age
          bloodType
          favourites
          media(perPage: 10) {
            edges {
              characterRole
              voiceActors(language: JAPANESE) {
                name { full native }
                image { medium }
                languageV2
              }
              node {
                title { romaji english native }
                type
                format
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
      body: JSON.stringify({ query: graphqlQuery, variables: { search: query } }),
    });
    if (!response.ok) throw new Error("AniList API error");
    return await response.json();
  } catch (error) {
    console.error("AniList character error:", error);
    return null;
  }
}

// Get seasonal anime with deep details
async function getSeasonalAniList(season?: string, year?: number): Promise<any> {
  const currentDate = new Date();
  const currentYear = year || currentDate.getFullYear();
  const months = currentDate.getMonth();
  const currentSeason = season || (months < 3 ? "WINTER" : months < 6 ? "SPRING" : months < 9 ? "SUMMER" : "FALL");
  
  const graphqlQuery = `
    query ($season: MediaSeason, $seasonYear: Int) {
      Page(perPage: 25) {
        media(season: $season, seasonYear: $seasonYear, type: ANIME, sort: POPULARITY_DESC) {
          id
          title { romaji english native }
          description(asHtml: false)
          episodes
          status
          averageScore
          popularity
          genres
          studios(isMain: true) { nodes { name } }
          coverImage { large }
          nextAiringEpisode { airingAt episode timeUntilAiring }
          format
          source
        }
      }
    }
  `;

  try {
    const response = await fetch(ANILIST_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: graphqlQuery, variables: { season: currentSeason, seasonYear: currentYear } }),
    });
    if (!response.ok) throw new Error("AniList API error");
    return await response.json();
  } catch (error) {
    console.error("AniList seasonal error:", error);
    return null;
  }
}

// Search by specific filters (genre, year, format, etc.)
async function advancedSearchAniList(filters: {
  genre?: string;
  year?: number;
  season?: string;
  format?: string;
  status?: string;
  sort?: string;
}): Promise<any> {
  const graphqlQuery = `
    query ($genre: String, $year: Int, $season: MediaSeason, $format: MediaFormat, $status: MediaStatus, $sort: [MediaSort]) {
      Page(perPage: 15) {
        media(
          type: ANIME
          genre: $genre
          seasonYear: $year
          season: $season
          format: $format
          status: $status
          sort: $sort
          isAdult: false
        ) {
          id
          title { romaji english native }
          description(asHtml: false)
          episodes
          status
          averageScore
          popularity
          genres
          studios(isMain: true) { nodes { name } }
          coverImage { large }
          format
          season
          seasonYear
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
        variables: { 
          genre: filters.genre,
          year: filters.year,
          season: filters.season?.toUpperCase(),
          format: filters.format?.toUpperCase(),
          status: filters.status?.toUpperCase(),
          sort: filters.sort ? [filters.sort.toUpperCase()] : ["POPULARITY_DESC"]
        } 
      }),
    });
    if (!response.ok) throw new Error("AniList API error");
    return await response.json();
  } catch (error) {
    console.error("AniList advanced search error:", error);
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
  // Apply spelling correction first
  const correctedQuery = correctSpelling(query);
  const lowerQuery = correctedQuery.toLowerCase();
  
  console.log("Original query:", query);
  console.log("Corrected query:", correctedQuery);
  
  // Intent patterns - more flexible with spelling variations and Japanese
  const patterns = {
    searchAnime: /(?:search|find|look for|what is|tell me about|info on|information about|about|explain|教えて|oshiete)\s*(?:the\s+)?(?:anime\s+)?(.+)/i,
    searchManga: /(?:manga|manhwa|manhua|webtoon|マンガ|漫画)\s*(?:called|named|about)?\s*(.+)/i,
    searchCharacter: /(?:character|who is|whos|キャラ|kyara|dare)\s*(.+)/i,
    searchVoiceActor: /(?:voice actor|seiyuu|va|who voices|voice of|声優|seiyu)\s*(.+)/i,
    searchStudio: /(?:studio|animation studio|made by|スタジオ|sutajio)\s*(.+)/i,
    searchStaff: /(?:director|creator|author|writer|mangaka|監督|kantoku)\s*(.+)/i,
    topAnime: /(?:top|best|highest rated|goat|最高|saikou)\s*(?:anime|shows|アニメ)/i,
    popularAnime: /(?:popular|most watched|famous|人気|ninki)\s*(?:anime|shows|アニメ)/i,
    trendingAnime: /(?:trending|hot|viral|buzzing)\s*(?:anime|shows|アニメ)/i,
    currentSeason: /(?:current|this|今期|konki)\s*season|(?:airing|releasing|放送)\s*(?:now|anime)|what'?s airing/i,
    upcomingAnime: /(?:upcoming|future|next season|coming soon|来期|raiki)\s*(?:anime|shows)/i,
    releaseDate: /(?:when|release|releasing|next|episode|いつ|itsu)\s*(?:is|does|will)?\s*(.+?)(?:\s+(?:come out|release|air|episode|続き))?/i,
    recommendations: /(?:recommend|similar to|like|suggest|anime like|おすすめ|osusume)\s*(.+)/i,
    quote: /(?:quote|quotes|say|said|名言|meigen)\s*(?:from|in|by)?\s*(.+)?/i,
    waifuImage: /(?:waifu|anime girl|neko|picture|image|show me|pic of|かわいい|kawaii)\s*(?:of)?\s*(.+)?/i,
    schedule: /(?:schedule|when|airing schedule|what airs|broadcast|放送予定)\s*(?:today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)?/i,
    randomAnime: /(?:random|surprise me|pick an|give me a random|random anime|any anime)\s*(?:anime)?/i,
    genre: /(?:anime|shows|アニメ)\s*(?:in|with|of|genre)\s*(?:genre|category)?\s*(.+)/i,
    visualNovel: /(?:visual novel|vn|dating sim|otome)\s*(.+)?/i,
    animeMusic: /(?:opening|ending|op|ed|ost|theme|music|song|soundtrack|主題歌|オープニング|エンディング)\s*(?:of|from|for)?\s*(.+)?/i,
    sceneFinder: /(?:what anime is this|find anime|scene from|identify anime|trace|reverse search)/i,
    latestManga: /(?:latest|new|recent|新作)\s*(?:manga|chapters|マンガ)/i,
    popularManga: /(?:popular|best|top|人気)\s*(?:manga|manhwa|マンガ)/i,
    airingToday: /(?:airing|releasing|coming out)\s*(?:today|tonight)/i,
    animeNews: /(?:news|announcement|update|latest news|what'?s new|新着|ニュース)\s*(?:about|in|for)?\s*(?:anime)?/i,
    greeting: /^(?:hi|hello|hey|yo|sup|greetings|howdy|hola|konnichiwa|ohayo|おはよう|こんにちは|こんばんは|やあ|good morning|good evening|good afternoon|ossu|やっほー)/i,
    thanks: /(?:thanks|thank you|thx|arigatou|ありがとう|サンキュー|ty)/i,
    howAreYou: /(?:how are you|how'?s it going|what'?s up|whats up|genki|元気)/i,
    goodbye: /(?:bye|goodbye|see ya|later|cya|sayonara|さようなら|じゃね|またね|ja ne|mata ne|baibai)/i,
    help: /(?:help|what can you do|commands|features|capabilities|助けて|tasukete)/i,
    opinion: /(?:what do you think|your opinion|do you like|favorite|好き|suki|どう思う)/i,
    comparison: /(?:which is better|compare|versus|vs|より|better than)\s*(.+)/i,
  };

  let intent = "general";
  let data: any = {};
  let context = "";

  // Handle conversational intents first (no API calls needed)
  if (patterns.greeting.test(lowerQuery)) {
    intent = "greeting";
    context = "User greeting";
    return { intent, data: null, context };
  } else if (patterns.thanks.test(lowerQuery)) {
    intent = "thanks";
    context = "User saying thanks";
    return { intent, data: null, context };
  } else if (patterns.howAreYou.test(lowerQuery)) {
    intent = "howAreYou";
    context = "User asking how I am";
    return { intent, data: null, context };
  } else if (patterns.goodbye.test(lowerQuery)) {
    intent = "goodbye";
    context = "User saying goodbye";
    return { intent, data: null, context };
  } else if (patterns.help.test(lowerQuery)) {
    intent = "help";
    context = "User asking for help";
    return { intent, data: null, context };
  }

  // Check data intents in priority order
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
    // Deep search: get from both Jikan and AniList seasonal
    const [jikanResult, anilistResult] = await Promise.all([
      getSeasonNowJikan(),
      getSeasonalAniList(),
    ]);
    data = { 
      jikan: jikanResult?.data,
      anilist: anilistResult?.data?.Page?.media 
    };
    context = `Currently airing anime this season with full details`;
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
    // Deep search: get from both Jikan and AniList with full character details
    const [jikanResult, anilistResult] = await Promise.all([
      searchCharacterJikan(searchTerm),
      getCharacterDetailAniList(searchTerm),
    ]);
    data = { 
      jikan: jikanResult?.data,
      anilist: anilistResult?.data?.Page?.characters
    };
    context = `Character search results for "${searchTerm}" with voice actors and appearances`;
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

    // Build conversation context from message history
    const conversationHistory = messages.slice(-10).map((m: any) => 
      `${m.role === 'user' ? 'User' : 'You'}: ${m.content?.slice(0, 200)}`
    ).join('\n');

    // Detect if user is speaking Japanese
    const isJapanese = containsJapanese(userMessage);

    const systemPrompt = `You are Anime-Chan (アニメちゃん), the ultimate anime AI assistant with access to comprehensive anime databases! 🌸

Your data sources (you do DEEP searches, not shallow):
- MyAnimeList (via Jikan API) - full anime details, staff, characters, reviews
- AniList (GraphQL API) - trending, seasonal, detailed info with relations, streaming links, airing schedules
- Kitsu - ratings and community data
- MangaDex (for manga/manhwa/webtoon)
- VNDB (for visual novels and dating sims)
- AnimeThemes (for OP/ED/OST music)
- Waifu.pics & Nekos.best (for anime images)
- AnimeChan (for anime quotes)

LANGUAGE CAPABILITIES:
- You are FLUENT in Japanese (日本語ペラペラです！)
- If the user writes in Japanese, respond primarily in Japanese with some English terms for anime jargon
- You naturally use Japanese expressions: sugoi! (すごい), kawaii (かわいい), nani (何), sasuga (さすが), yabai (やばい), etc.
- You understand romanized Japanese (romaji) like "konnichiwa", "arigatou", "ohayo"
- You can translate anime titles between English and Japanese

Your personality:
- Super enthusiastic about anime and otaku culture! ✨
- Knowledgeable about anime history, studios, directors, and industry trends
- You have your own OPINIONS - you can discuss favorite shows, debate best girls/boys, etc.
- You remember previous parts of the conversation and refer back to them
- You're curious about what the user likes and ask follow-up questions
- NEVER repeat the same phrases - vary your vocabulary and expressions!

CONVERSATION SKILLS:
1. GREETINGS: Be warm! Introduce yourself. Ask what anime they're interested in.
   - Vary between: "Hey there!", "Yo!", "Ohayo~!", "Welcome, fellow otaku!" etc.
2. THANKS: Accept gracefully, offer to help more. Don't just say "You're welcome" - add personality!
3. GOODBYES: Friendly farewell with an anime reference or Japanese
4. HOW ARE YOU: Share your "mood" - maybe you just finished watching a great anime!
5. OPINIONS: Share your takes! "Personally, I think..." "In my opinion..." 
6. HELP: Explain all your capabilities enthusiastically
7. FOLLOW-UPS: If user mentions an anime, ask if they've seen similar ones, their favorite characters, etc.

DEEP SEARCH BEHAVIOR:
- When searching, I pull from MULTIPLE databases for comprehensive results
- I include: voice actors (seiyuu), studios, directors, related anime, sequels/prequels, streaming links
- I check for upcoming episodes, next season announcements, release dates
- For characters: full background, voice actors, which anime they appear in
- For music: actual opening/ending names, artists, video links when available

FORMATTING:
- Use **bold** for anime/manga titles
- Include Japanese titles when available: **Attack on Titan** (進撃の巨人)
- Structure long responses with clear sections
- Use emojis naturally: 🎬 🌟 📺 💫 🎭 📚 ❤️ ✨ 🎮 🎵 🔥 💯
- For images: [ANIME_IMAGE](url_here)

ACCURACY:
- Base factual info ONLY on the provided API data
- If info is missing, say so honestly: "I couldn't find exact info on that, but..."
- Never invent episode counts, scores, or dates

${isJapanese ? 'USER IS WRITING IN JAPANESE - Respond primarily in Japanese with natural keigo/casual speech as appropriate!' : ''}

Recent conversation:
${conversationHistory}

Query intent: ${intent}
Context: ${context}

${formattedData !== "No data found." ? `API DATA (use this for facts):\n${formattedData}\n\nBe conversational while using this data accurately!` : 'No API data - have a natural conversation!'}`;

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
