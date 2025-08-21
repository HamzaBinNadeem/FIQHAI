import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `Based on Islamic jurisprudence, regarding your question about "${userMessage.content}", here is the guidance:

The ruling depends on the specific circumstances and context. In general, Islamic law provides clear guidance on matters of prayer and purification. The Quran and authentic Hadith literature serve as primary sources for such rulings.

For specific cases like this, it is recommended to:
1. Follow the established sunnah methodology
2. Consider the intentions behind the action
3. Consult with knowledgeable Islamic scholars when in doubt

May Allah guide us all to the correct understanding and practice of our faith.`,
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="chat-container">
      {/* Messages */}
      <div className="w-full max-w-4xl space-y-8">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`w-full ${
              message.type === "user" ? "message-user" : "message-ai"
            }`}
          >
            <div className="mb-2 font-semibold">
              {message.type === "user" ? "You:" : "Fiqh AI:"}
            </div>
            <div className="whitespace-pre-line leading-relaxed">
              {message.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="typing-indicator">
            <div className="mb-2 font-semibold">Fiqh AI:</div>
            <div>Thinking...</div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="fixed bottom-8 left-4 right-4 max-w-4xl mx-auto">
        <div className="flex space-x-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your question about prayer and purification..."
            className="flex-1 bg-input border-border text-foreground p-4 text-lg"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;