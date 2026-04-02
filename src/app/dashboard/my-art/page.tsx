"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle2, XCircle, PlayCircle, Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const TABS = ["Pending", "Approved", "Rejected"];

import { useStore } from "@/lib/store";

export default function MyArtPage() {
    const [activeTab, setActiveTab] = useState("Pending");
    const { artworks, currentUser } = useStore();

    const filteredArt = artworks.filter(art => art.status === activeTab && art.userEmail === currentUser?.email);

    return (
        <div className="max-w-6xl mx-auto space-y-8 pt-4">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2 text-glow text-white">My Portfolio</h1>
                    <p className="text-foreground/70">Track your submissions and link music to approved artworks.</p>
                </div>
                <Link href="/dashboard/upload">
                    <Button className="bg-neon-cyan text-black hover:bg-neon-cyan/90 border-none shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] transition-all">
                        <Plus className="h-5 w-5 mr-2" /> Upload New
                    </Button>
                </Link>
            </header>

            {/* Tabs */}
            <div className="flex space-x-1 p-1 bg-black/40 rounded-xl border border-white/5 w-fit">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative px-6 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === tab ? "text-white" : "text-white/50 hover:text-white/80"
                            }`}
                    >
                        {activeTab === tab && (
                            <motion.div
                                layoutId="portfolio-tab"
                                className="absolute inset-0 bg-white/10 rounded-lg"
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            {tab === "Pending" && <Clock className="h-4 w-4" />}
                            {tab === "Approved" && <CheckCircle2 className="h-4 w-4" />}
                            {tab === "Rejected" && <XCircle className="h-4 w-4" />}
                            {tab}
                        </span>
                    </button>
                ))}
            </div>

            {/* Grid */}
            <AnimatePresence mode="wait">
                {filteredArt.length > 0 ? (
                    <motion.div
                        key={`${activeTab}-grid`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4"
                    >
                        {filteredArt.map((art, i) => (
                            <motion.div
                                key={art.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className="bg-black/40 rounded-xl border border-white/5 overflow-hidden group flex flex-col hover:border-white/20 transition-colors shadow-lg"
                            >
                                <div className="aspect-square w-full relative overflow-hidden">
                                    <img src={art.image} alt={art.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <div className="p-5 flex-1 flex flex-col justify-between relative z-10 -mt-8 bg-gradient-to-t from-black via-black to-transparent">
                                    <h3 className="font-bold text-lg text-white mb-2">{art.title}</h3>

                                    {art.status === "Approved" && !art.hasMusic && (
                                        <Link href={`/dashboard/artwork/${art.id}/add-music`}>
                                            <Button variant="outline" className="w-full border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10 mt-3 py-2 h-auto text-xs uppercase tracking-wider font-bold shadow-[0_0_10px_rgba(0,243,255,0.1)] hover:shadow-[0_0_15px_rgba(0,243,255,0.2)]">
                                                Add Music
                                            </Button>
                                        </Link>
                                    )}

                                    {art.status === "Approved" && art.hasMusic && (
                                        <div className="w-full flex items-center justify-center gap-2 py-3 mt-3 bg-neon-pink/10 border border-neon-pink/20 rounded-lg text-neon-pink font-medium text-xs tracking-wide">
                                            <PlayCircle className="h-4 w-4" /> Music Linked
                                        </div>
                                    )}

                                    {art.status === "Rejected" && (
                                        <p className="text-xs text-red-400 mt-3 bg-red-400/10 p-3 rounded-lg border border-red-400/20 text-center font-medium">Does not meet community guidelines.</p>
                                    )}

                                    {art.status === "Pending" && (
                                        <p className="text-xs text-orange-300 mt-3 bg-orange-500/10 p-3 rounded-lg border border-orange-500/20 text-center font-medium">Awaiting admin moderation.</p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key={`${activeTab}-empty`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.02] mt-4"
                    >
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/5">
                            {activeTab === "Pending" && <Clock className="h-10 w-10 text-white/30" />}
                            {activeTab === "Approved" && <CheckCircle2 className="h-10 w-10 text-white/30" />}
                            {activeTab === "Rejected" && <XCircle className="h-10 w-10 text-white/30" />}
                        </div>
                        <h3 className="text-xl font-medium text-white mb-3">No {activeTab.toLowerCase()} artworks</h3>
                        <p className="text-white/40 max-w-sm text-sm">
                            {activeTab === "Approved" ? "When admins approve your art, it will appear here so you can add music." : "You have no artworks currently in this state. Keep creating!"}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
