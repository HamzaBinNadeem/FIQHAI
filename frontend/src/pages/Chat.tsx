import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import ReactMarkdown from "react-markdown";
import TypingIndicator from "@/components/TypingIndicator";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
}

const API_BASE = import.meta.env?.VITE_API_BASE_URL || "";

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showInitialPrompt, setShowInitialPrompt] = useState(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cameFromLanding = sessionStorage.getItem("cameFromLanding");
  
    if (!cameFromLanding) {
      navigate("/"); 
    } else {
      sessionStorage.removeItem("cameFromLanding");
    }
  }, [navigate]);
  

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    scrollToBottom();

    if (showInitialPrompt) {
      setTimeout(() => setShowInitialPrompt(false), 300);
    }

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });



      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      const aiMessageId = Date.now().toString();

      setMessages((prev) => [
        ...prev,
        { id: aiMessageId, type: "ai", content: "" },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId ? { ...msg, content: fullText } : msg
          )
        );

        scrollToBottom();
      }
    } catch (err: any) {
      const aiError: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: err?.message || "Network error. Please try again.",
      };
      setMessages((prev) => [...prev, aiError]);
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div className="min-h-screen transition-colors duration-500 bg-black">
      <Navbar />

      <div className="pt-24 px-4 max-w-4xl mx-auto">
        {showInitialPrompt ? (
          <div className="min-h-[80vh] flex flex-col items-center justify-center text-center transition-all duration-700">
            <h2 className="text-3xl font-semibold mb-8 animate-fade-in text-white">
              Hey! Have some questions? Ask away.
            </h2>

            <div
              className={`w-full max-w-2xl relative transition-all duration-700 ease-in-out ${
                showInitialPrompt ? "animate-slide-up" : "animate-slide-down"
              }`}
            >
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border bg-gray-900 border-gray-700">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g. What is the ruling on performing Wudu after eating camel meat?"
                  className="flex-1 bg-transparent text-lg italic text-white placeholder:italic placeholder:text-gray-00 border-none outline-none focus:outline-gray-00 focus:ring-0 focus:border-transparent focus:shadow"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-purple-600 hover:bg-purple-700 rounded-xl p-2 h-10 w-10 flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
                <p className="text-center text-sm mt-2 text-gray-400">
                  *Educational purposes only. Consult a scholar for authentic advice.
                </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-32 animate-fade-in transition-all duration-700">
            {messages.map((message) => {
              if (message.type === "ai" && !message.content.trim() && !isTyping)
                return null;

              return (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  } animate-slide-up`}
                >
                  <div
                    className={`max-w-3xl p-4 rounded-2xl transition-all duration-300 ${
                      message.type === "user"
                        ? "bg-purple-600 text-white ml-4"
                        : "bg-gray-800 text-white mr-4"
                    }`}
                  >
                    <div className="prose prose-invert prose-sm">
                      {message.content.trim() ? (
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      ) : isTyping && message.type === "ai" ? (
                        <div className="flex items-center space-x-2 text-sm text-gray-300">
                          <TypingIndicator />
                          <span>Analyzing your question...</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}

        {!showInitialPrompt && (
          <div className="fixed bottom-0 left-0 right-0 border-t transition-all duration-700 ease-in-out p-4 bg-black/90 backdrop-blur-sm border-gray-800">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border bg-gray-900 border-gray-700">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g. What is the ruling on performing Wudu after eating camel meat?"
                  className="flex-1 bg-transparent text-lg italic text-white placeholder:italic placeholder:text-gray-400 border-none outline-none focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isTyping}
                  className="bg-purple-600 hover:bg-purple-700 rounded-xl p-2 h-10 w-10 flex items-center justify-center"
                  title={isTyping ? "Please wait…" : "Send"}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-center text-sm mt-2 text-gray-400">
              *Educational purposes only. Consult a scholar for authentic advice.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
