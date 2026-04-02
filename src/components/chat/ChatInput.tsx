// removed use client

import { Send, PlusCircle } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";

type ChatInputProps = {
    onSend: (message: string) => void;
    disabled?: boolean;
};

export function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [input, setInput] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !disabled) {
            onSend(input);
            setInput("");
            if (textareaRef.current) {
                textareaRef.current.style.height = "56px";
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent);
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = "56px";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex items-end gap-3 px-2">
            <button
                type="button"
                className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors shrink-0 mb-0.5 shadow-sm"
                aria-label="Add attachment"
            >
                <PlusCircle className="h-5 w-5 text-foreground/70" />
            </button>

            <div className="relative flex-1 overflow-hidden rounded-[1.25rem] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus-within:ring-2 focus-within:ring-foreground/10 transition-shadow shadow-sm">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Message AI Assistant..."
                    disabled={disabled}
                    rows={1}
                    className="w-full bg-transparent border-none py-4 px-5 pr-14 focus:outline-none resize-none text-[15px] leading-relaxed max-h-[150px] placeholder:text-foreground/40 disabled:opacity-50"
                    style={{ minHeight: "56px" }}
                />
                <Button
                    type="submit"
                    disabled={disabled || !input.trim()}
                    className="absolute right-1.5 bottom-1.5 h-11 w-11 p-0 rounded-xl"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </form>
    );
}
