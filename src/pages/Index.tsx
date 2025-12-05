import { useRef, useEffect } from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { SuggestionChips } from "@/components/chat/SuggestionChips";
import { useAnimeChat } from "@/hooks/useAnimeChat";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const Index = () => {
  const { messages, isLoading, sendMessage, clearMessages } = useAnimeChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-neon-pink/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-neon-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />
      </div>

      <div className="relative flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 pb-4">
        {/* Header */}
        <ChatHeader />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
              <div className="glass-card rounded-2xl p-8 max-w-2xl w-full">
                <h2 className="text-xl font-display font-semibold text-center mb-6 text-foreground">
                  ✨ Try asking me something! ✨
                </h2>
                <SuggestionChips onSelect={sendMessage} />
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  role={message.role}
                  content={message.content}
                  isLoading={isLoading && index === messages.length - 1 && message.role === "assistant" && !message.content}
                />
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <ChatMessage role="assistant" content="" isLoading />
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Clear Chat Button */}
        {messages.length > 0 && (
          <div className="flex justify-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearMessages}
              className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear conversation
            </Button>
          </div>
        )}

        {/* Input Area */}
        <div className="sticky bottom-4">
          <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Index;
