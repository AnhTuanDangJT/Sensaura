"use client";

import { Bell, Search, LogOut } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export function Topbar() {
    const { currentUser, logout } = useStore();
    const router = useRouter();

    return (
        <header className="h-16 border-b border-black/5 dark:border-white/5 flex items-center justify-between px-6 bg-background/80 backdrop-blur-md sticky top-0 z-30">
            <div className="flex-1 max-w-md relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                <Input
                    placeholder="Search everything..."
                    className="h-10 pl-9 rounded-full bg-black/5 dark:bg-white/5 border-transparent focus-visible:ring-1 focus-visible:ring-foreground/20 text-sm"
                />
            </div>

            <div className="flex items-center gap-4 ml-auto">
                <button className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <Bell className="h-5 w-5 text-foreground/70" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
                </button>
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm shadow-md cursor-pointer ring-2 ring-transparent hover:ring-foreground/20 transition-all">
                    {currentUser ? currentUser.name.substring(0, 2).toUpperCase() : "—"}
                </div>
                <button 
                  title="Sign Out" 
                  onClick={async () => { await logout(); router.push('/'); }} 
                  className="relative p-2 rounded-full hover:bg-neon-pink/10 text-white/60 hover:text-neon-pink transition-colors ml-2"
                >
                    <LogOut className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
}
