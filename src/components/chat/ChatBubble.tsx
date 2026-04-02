// removed use client

import { Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
    id: string;
    role: "user" | "ai";
    content: string;
    isStreaming?: boolean;
};

export function ChatBubble({ message }: { message: Message }) {
    const isAI = message.role === "ai";

    return (
        <div className={cn("flex gap-4 max-w-3xl", isAI ? "mr-auto items-end" : "ml-auto flex-row-reverse items-end")}>
            <div
                className={cn(
                    "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white mb-1",
                    isAI ? "bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-md shadow-indigo-500/20" : "bg-black/20 dark:bg-white/20 text-foreground"
                )}
            >
                {isAI ? <Sparkles className="h-4 w-4" /> : <User className="h-4 w-4 text-foreground/80" />}
            </div>

            <div
                className={cn(
                    "px-5 py-3.5 rounded-2xl border shadow-sm",
                    isAI
                        ? "bg-white/80 dark:bg-black/60 border-black/5 dark:border-white/5 rounded-bl-sm text-foreground"
                        : "bg-foreground text-background border-transparent rounded-br-sm shadow-md"
                )}
            >
                {message.isStreaming ? (
                    <>
                        <style>{`
              @keyframes typing {
                from { width: 0 }
                to { width: 100% }
              }
              .typewriter {
                overflow: hidden;
                white-space: nowrap;
                animation: typing 2s steps(40, end);
                display: inline-block;
                vertical-align: bottom;
              }
              .cursor-blink {
                display: inline-block;
                width: 2px;
                height: 1.2em;
                background-color: currentColor;
                vertical-align: middle;
                margin-left: 4px;
                animation: blink 1s step-end infinite;
              }
              @keyframes blink {
                50% { opacity: 0; }
              }
            `}</style>
                        <div className="typewriter">
                            <p className="leading-relaxed m-0 text-[15px]">{message.content}</p>
                        </div>
                        <span className="cursor-blink" />
                    </>
                ) : (
                    <p className="leading-relaxed whitespace-pre-wrap m-0 text-[15px]">{message.content}</p>
                )}
            </div>
        </div>
    );
}
