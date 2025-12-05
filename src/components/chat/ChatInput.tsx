import { useState, KeyboardEvent } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative">
      <div className="glass-card rounded-2xl p-2 border border-neon-pink/20 focus-within:border-neon-pink/50 transition-all duration-300 focus-within:neon-glow-pink">
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about anime... 🌸"
            disabled={disabled}
            className={cn(
              "flex-1 min-h-[48px] max-h-[200px] resize-none border-0 bg-transparent",
              "placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0",
              "text-foreground font-body text-base"
            )}
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || disabled}
            className={cn(
              "h-12 w-12 rounded-xl flex-shrink-0",
              "bg-gradient-to-r from-neon-pink to-neon-purple",
              "hover:opacity-90 transition-all duration-300",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "neon-glow-pink"
            )}
          >
            {disabled ? (
              <Sparkles className="w-5 h-5 animate-pulse" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
      <div className="text-center mt-2">
        <span className="text-xs text-muted-foreground/60">
          Press Enter to send • Shift + Enter for new line
        </span>
      </div>
    </div>
  );
}
