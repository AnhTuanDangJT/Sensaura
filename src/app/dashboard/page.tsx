"use client";

import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { PlayCircle, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";

export default function DashboardPage() {
    const { artworks } = useStore();
    const publicArtworks = artworks.filter(art => art.status === "Approved");

    return (
        <div className="space-y-8">
            <header className="mb-10 text-center sm:text-left">
                <h1 className="text-4xl font-bold tracking-tight mb-3 text-glow text-white">Curated Gallery</h1>
                <p className="text-foreground/70 text-lg max-w-2xl">
                    Discover breathtaking visual art paired with immersive sonic experiences.
                </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {publicArtworks.map((art, i) => (
                    <Link href={`/dashboard/artwork/${art.id}`} key={art.id}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="group relative overflow-hidden rounded-2xl cursor-pointer border border-white/5 bg-black"
                        >
                            <div className="aspect-[4/5] relative overflow-hidden">
                                <img
                                    src={art.image}
                                    alt={art.title}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:blur-sm"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                {/* Content */}
                                <div className="absolute inset-0 p-6 flex flex-col justify-end transition-transform duration-500 group-hover:-translate-y-2">
                                    <div className="flex justify-between items-end mb-2">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-1 tracking-tight group-hover:text-neon-pink transition-colors">{art.title}</h3>
                                            <p className="text-white/70 font-medium">by {art.artist}</p>
                                        </div>
                                        {art.hasMusic && (
                                            <div className="w-12 h-12 rounded-full bg-neon-pink/20 backdrop-blur-md flex items-center justify-center border border-neon-pink/50 text-neon-pink shadow-[0_0_15px_rgba(255,42,133,0.5)] group-hover:scale-110 transition-transform">
                                                <PlayCircle className="h-6 w-6" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 flex items-center gap-2">
                                        {art.status === "Approved" ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold backdrop-blur-md border border-green-500/30">
                                                <CheckCircle2 className="h-3 w-3" /> Approved
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-semibold backdrop-blur-md border border-orange-500/30">
                                                <Clock className="h-3 w-3" /> Pending Review
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
