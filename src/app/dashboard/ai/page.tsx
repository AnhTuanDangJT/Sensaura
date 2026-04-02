"use client";

import { ChatBubble } from "@/components/chat/ChatBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

type Message = {
    id: string;
    role: "user" | "ai";
    content: string;
    isStreaming?: boolean;
};

export default function AIChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "ai",
            content: "Hello! I'm your premium AI assistant. How can I help you elevate your workflow today?",
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = (content: string) => {
        const userMsg: Message = { id: Date.now().toString(), role: "user", content };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        setTimeout(() => {
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: `I understand you want to talk about "${content}". As an AI assistant, I'm here to help you brainstorm, analyze, and create amazing things with that concept! Let's get started.`,
                isStreaming: true
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);

            // Remove streaming flag after animation duration
            setTimeout(() => {
                setMessages(prev => prev.map(m => m.id === aiMsg.id ? { ...m, isStreaming: false } : m));
            }, 2000);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <header className="mb-6 flex-shrink-0">
                <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-xl">
                        <Sparkles className="h-7 w-7 text-indigo-500" />
                    </div>
                    AI Assistant
                </h1>
                <p className="text-foreground/60">
                    Brainstorm ideas, analyze data, and accelerate your creativity.
                </p>
            </header>

            <div className="flex-1 overflow-hidden relative glass-card p-0 flex flex-col pt-0 mb-6 drop-shadow-sm border-transparent bg-white/60 dark:bg-black/40">
                {/* Messages context */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                    {messages.map((msg) => (
                        <ChatBubble key={msg.id} message={msg} />
                    ))}
                    {isTyping && (
                        <div className="flex gap-4 p-2 items-end">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex-shrink-0 flex items-center justify-center text-white mb-1 shadow-md">
                                <Sparkles className="h-4 w-4" />
                            </div>
                            <div className="bg-white/80 dark:bg-black/60 px-5 py-3.5 rounded-2xl rounded-bl-sm border border-black/5 dark:border-white/5 flex items-center gap-1.5 h-12 w-20 shadow-sm">
                                <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-b-2xl border-t border-black/5 dark:border-white/5">
                    <ChatInput onSend={handleSend} disabled={isTyping} />
                </div>
            </div>
        </div>
    );
}
