"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Image as ImageIcon, Upload, UserCircle, Menu, ChevronLeft, Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { canSeeAdminPanel } from "@/lib/isAdminClient";

const navItems = [
    { icon: ImageIcon, label: "Gallery", href: "/dashboard" },
    { icon: Upload, label: "Upload Art", href: "/dashboard/upload" },
    { icon: UserCircle, label: "My Portfolio", href: "/dashboard/my-art" },
];

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const { currentUser } = useStore();

    const activeNavItems = currentUser 
        ? (canSeeAdminPanel(currentUser)
            ? [...navItems, { icon: ShieldCheck, label: "Admin Panel", href: "/dashboard/admin" }]
            : navItems)
        : navItems.filter(item => item.label === "Gallery");

    return (
        <motion.aside
            animate={{ width: collapsed ? 80 : 260 }}
            className="hidden md:flex relative h-screen bg-black/40 backdrop-blur-xl border-r border-white/5 flex flex-col z-40 transition-shadow"
        >
            <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
                {!collapsed && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-heading text-2xl font-bold tracking-tight text-white flex items-center gap-2"
                    >
                        <Sparkles className="h-5 w-5 text-neon-pink" />
                        Muse
                    </motion.span>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors ml-auto"
                >
                    {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
                {activeNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <div
                                className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative overflow-hidden",
                                    isActive
                                        ? "text-white font-medium"
                                        : "text-white/60 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="active-nav"
                                        className="absolute inset-0 bg-gradient-to-r from-neon-pink/20 to-neon-purple/20 rounded-xl border border-neon-pink/30"
                                    />
                                )}
                                <item.icon className={cn("h-5 w-5 shrink-0 relative z-10", isActive && "text-neon-pink")} />
                                {!collapsed && (
                                    <span className="relative z-10">{item.label}</span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {!currentUser && !collapsed && (
                <div className="px-6 py-8 mt-auto border-t border-white/5">
                    <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-4">Limited Experience</p>
                    <Link href="/auth/login" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-neon-pink to-neon-purple text-white text-sm font-bold shadow-[0_0_20px_rgba(255,42,133,0.3)] hover:scale-[1.02] transition-transform">
                        Sign In / Join
                    </Link>
                </div>
            )}
        </motion.aside>
    );
}
