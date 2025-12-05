import { cn } from "@/lib/utils";
import { 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  Heart, 
  Quote, 
  Search,
  BookOpen,
  Users
} from "lucide-react";

interface SuggestionChipsProps {
  onSelect: (suggestion: string) => void;
}

const suggestions = [
  { text: "What's airing this season?", icon: Calendar, color: "from-neon-pink to-neon-purple" },
  { text: "Top rated anime of all time", icon: TrendingUp, color: "from-neon-cyan to-neon-blue" },
  { text: "Random anime quote", icon: Quote, color: "from-neon-purple to-neon-pink" },
  { text: "Recommend anime like Attack on Titan", icon: Heart, color: "from-neon-blue to-neon-cyan" },
  { text: "Search character Goku", icon: Users, color: "from-neon-pink to-neon-cyan" },
  { text: "Tell me about One Piece", icon: Search, color: "from-neon-cyan to-neon-purple" },
  { text: "Popular manga right now", icon: BookOpen, color: "from-neon-purple to-neon-blue" },
  { text: "Show me a waifu image", icon: Sparkles, color: "from-neon-pink to-neon-purple" },
];

export function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {suggestions.map((suggestion, index) => {
        const Icon = suggestion.icon;
        return (
          <button
            key={index}
            onClick={() => onSelect(suggestion.text)}
            className={cn(
              "group flex items-center gap-2 px-4 py-2 rounded-full",
              "bg-muted/50 border border-border/50",
              "hover:border-neon-pink/50 hover:bg-muted",
              "transition-all duration-300 hover:scale-105",
              "text-sm font-medium text-muted-foreground hover:text-foreground"
            )}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <div className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center",
              `bg-gradient-to-r ${suggestion.color}`,
              "group-hover:animate-pulse-glow"
            )}>
              <Icon className="w-3 h-3 text-foreground" />
            </div>
            <span>{suggestion.text}</span>
          </button>
        );
      })}
    </div>
  );
}
