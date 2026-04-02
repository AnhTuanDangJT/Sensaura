"use client";

import { cn } from "@/lib/utils";
import { Image as ImageIcon, Upload, UserCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { canSeeAdminPanel } from "@/lib/isAdminClient";

const navItems = [
    { icon: ImageIcon, label: "Gallery", href: "/dashboard" },
    { icon: Upload, label: "Upload", href: "/dashboard/upload" },
    { icon: UserCircle, label: "Portfolio", href: "/dashboard/my-art" },
];

export function MobileNav() {
    const pathname = usePathname();
    const { currentUser } = useStore();

    const items = canSeeAdminPanel(currentUser)
        ? [...navItems, { icon: ShieldCheck, label: "Admin", href: "/dashboard/admin" }]
        : navItems;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-2 z-50">
            {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center w-full h-full relative group">
                        {isActive && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-neon-pink rounded-b-full shadow-[0_0_10px_rgba(255,42,133,0.8)]" />
                        )}
                        <item.icon className={cn("h-5 w-5 mb-1 transition-transform group-hover:scale-110", isActive ? "text-neon-pink" : "text-white/40")} />
                        <span className={cn("text-[10px] font-medium", isActive ? "text-neon-pink" : "text-white/40")}>{item.label}</span>
                    </Link>
                );
            })}
        </div>
    );
}
