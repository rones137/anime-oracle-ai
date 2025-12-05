import { Sparkles, Zap } from "lucide-react";

export function ChatHeader() {
  return (
    <header className="text-center py-8 px-4">
      <div className="inline-flex items-center justify-center mb-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan rounded-full blur-xl opacity-50 animate-pulse-glow" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-neon-pink to-neon-purple flex items-center justify-center neon-glow-pink">
            <span className="text-4xl">🌸</span>
          </div>
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">
        <span className="bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-clip-text text-transparent">
          Anime-Chan
        </span>
      </h1>

      <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4 font-body">
        Your AI-powered anime companion! Ask me anything about anime, manga, characters, and more~
      </p>

      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground/70">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-neon-pink" />
          <span>MyAnimeList</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-neon-cyan" />
          <span>AniList</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
        <div className="flex items-center gap-1.5">
          <span className="text-neon-purple">✨</span>
          <span>AI Powered</span>
        </div>
      </div>
    </header>
  );
}
