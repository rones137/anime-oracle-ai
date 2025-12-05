import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
}

export function ChatMessage({ role, content, isLoading }: ChatMessageProps) {
  const isUser = role === "user";

  // Parse content for images
  const parseContent = (text: string) => {
    const imageRegex = /\[ANIME_IMAGE\]\((https?:\/\/[^\)]+)\)/g;
    const parts: (string | { type: "image"; url: string })[] = [];
    let lastIndex = 0;
    let match;

    while ((match = imageRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push({ type: "image", url: match[1] });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  const contentParts = parseContent(content);

  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-xl transition-all duration-300",
        isUser
          ? "bg-gradient-to-r from-neon-pink/10 to-neon-purple/10 border border-neon-pink/20 animate-slide-in-right"
          : "bg-gradient-to-r from-neon-cyan/5 to-neon-blue/5 border border-neon-cyan/20 animate-slide-in-left"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
          isUser
            ? "bg-gradient-to-br from-neon-pink to-neon-purple neon-glow-pink"
            : "bg-gradient-to-br from-neon-cyan to-neon-blue neon-glow-cyan"
        )}
      >
        {isUser ? (
          <User className="w-5 h-5 text-foreground" />
        ) : (
          <Bot className="w-5 h-5 text-dark-bg" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "text-sm font-semibold mb-1 font-display",
            isUser ? "text-neon-pink" : "text-neon-cyan"
          )}
        >
          {isUser ? "You" : "Anime-Chan"}
        </div>

        {isLoading ? (
          <div className="flex items-center gap-1.5">
            <div className="typing-dot w-2 h-2 rounded-full bg-neon-cyan" />
            <div className="typing-dot w-2 h-2 rounded-full bg-neon-cyan" />
            <div className="typing-dot w-2 h-2 rounded-full bg-neon-cyan" />
          </div>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
            {contentParts.map((part, index) => {
              if (typeof part === "string") {
                return (
                  <div
                    key={index}
                    className="text-foreground/90 leading-relaxed whitespace-pre-wrap"
                  >
                    {part}
                  </div>
                );
              } else if (part.type === "image") {
                return (
                  <img
                    key={index}
                    src={part.url}
                    alt="Anime"
                    className="rounded-lg max-w-xs mt-3 border border-neon-cyan/30 shadow-lg"
                    loading="lazy"
                  />
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
