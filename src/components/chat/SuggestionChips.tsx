import { cn } from "@/lib/utils";
import { 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  Heart, 
  Quote, 
  Search,
  BookOpen,
  Users,
  Music,
  Gamepad2,
  Shuffle,
  Tv,
  Star,
  Building2
} from "lucide-react";

interface SuggestionChipsProps {
  onSelect: (suggestion: string) => void;
}

const suggestions = [
  { text: "What's airing this season?", icon: Calendar, color: "from-neon-pink to-neon-purple" },
  { text: "Top rated anime of all time", icon: Star, color: "from-neon-cyan to-neon-blue" },
  { text: "Trending anime right now", icon: TrendingUp, color: "from-neon-purple to-neon-pink" },
  { text: "Random anime surprise me", icon: Shuffle, color: "from-neon-blue to-neon-cyan" },
  { text: "Random anime quote", icon: Quote, color: "from-neon-pink to-neon-cyan" },
  { text: "Recommend anime like Attack on Titan", icon: Heart, color: "from-neon-cyan to-neon-purple" },
  { text: "Search character Levi Ackerman", icon: Users, color: "from-neon-purple to-neon-blue" },
  { text: "Tell me about One Piece", icon: Search, color: "from-neon-pink to-neon-blue" },
  { text: "Popular manga right now", icon: BookOpen, color: "from-neon-cyan to-neon-pink" },
  { text: "Show me a waifu image", icon: Sparkles, color: "from-neon-pink to-neon-purple" },
  { text: "Voice actor Mamoru Miyano", icon: Users, color: "from-neon-blue to-neon-purple" },
  { text: "Studio MAPPA", icon: Building2, color: "from-neon-cyan to-neon-blue" },
  { text: "Opening theme from Demon Slayer", icon: Music, color: "from-neon-purple to-neon-cyan" },
  { text: "Visual novel Steins Gate", icon: Gamepad2, color: "from-neon-pink to-neon-blue" },
  { text: "Anime schedule today", icon: Tv, color: "from-neon-blue to-neon-pink" },
  { text: "Action genre anime", icon: Sparkles, color: "from-neon-cyan to-neon-purple" },
];

export function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center max-h-[300px] overflow-y-auto p-2">
      {suggestions.map((suggestion, index) => {
        const Icon = suggestion.icon;
        return (
          <button
            key={index}
            onClick={() => onSelect(suggestion.text)}
            className={cn(
              "group flex items-center gap-2 px-3 py-2 rounded-full",
              "bg-muted/50 border border-border/50",
              "hover:border-neon-pink/50 hover:bg-muted",
              "transition-all duration-300 hover:scale-105",
              "text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground"
            )}
            style={{
              animationDelay: `${index * 30}ms`,
            }}
          >
            <div className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
              `bg-gradient-to-r ${suggestion.color}`,
              "group-hover:animate-pulse-glow"
            )}>
              <Icon className="w-3 h-3 text-foreground" />
            </div>
            <span className="truncate">{suggestion.text}</span>
          </button>
        );
      })}
    </div>
  );
}
