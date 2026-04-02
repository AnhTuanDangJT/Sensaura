"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, PauseCircle, SkipBack, SkipForward, ArrowLeft, Heart, Share2, Volume2, FileText, X, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { sameEmail } from "@/lib/utils";

export default function ArtworkViewPage() {
    const params = useParams();
    const id = params?.id as string;
    const [playingIndex, setPlayingIndex] = useState<number | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { artworks, currentUser, removeMusicTrack } = useStore();
    const [removingIndex, setRemovingIndex] = useState<number | null>(null);

    const storeArt = artworks.find(a => a.id === id);
    const art: any = storeArt ? {
        ...storeArt,
        desc: storeArt.desc || "No description provided for this artwork." // Fallback mock description
    } : {
        id: "placeholder", title: "Unknown Canvas", artist: "Anonymous", hasMusic: false, image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&auto=format&fit=crop", desc: "No description provided for this artwork.", fileType: "image", userEmail: ""
    };

    const isOwner = sameEmail(currentUser?.email, art.userEmail);

    return (
        <>
            <AnimatePresence>
                {isModalOpen && art.fileType !== "pdf" && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ WebkitBackfaceVisibility: "hidden", backfaceVisibility: "hidden", willChange: "transform, opacity, backdrop-filter", transform: "translateZ(0)" }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg p-4 sm:p-10 cursor-zoom-out transform-gpu backface-hidden"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <button className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer z-50">
                            <X className="w-6 h-6" />
                        </button>
                        <motion.img 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            style={{ WebkitBackfaceVisibility: "hidden", backfaceVisibility: "hidden", WebkitTransform: "translate3d(0, 0, 0)", transform: "translateZ(0)" }}
                            src={art.image} 
                            alt={art.title} 
                            className="max-w-full max-h-full object-contain shadow-[0_0_100px_rgba(255,255,255,0.05)] cursor-default transform-gpu will-change-transform backface-hidden"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto pb-20 pt-4">
                <Link href="/dashboard" className="inline-flex items-center text-white/50 hover:text-white mb-8 group transition-colors uppercase tracking-widest text-xs font-semibold">
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Gallery
                </Link>

                <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20">
                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        style={{ willChange: "transform, opacity" }}
                        className={`relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-white/30 transform-gpu ${art.fileType !== "pdf" ? 'cursor-pointer hover:border-white/30 transition-colors group' : ''}`}
                        onClick={() => { if (art.fileType !== "pdf") setIsModalOpen(true); }}
                    >
                        {art.fileType === "pdf" ? (
                            <div className="flex items-center justify-center w-full h-full bg-black/40">
                                <FileText className="w-24 h-24 text-white/20" />
                            </div>
                        ) : (
                            <>
                                <img src={art.image} alt={art.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                                    <div className="bg-white/10 backdrop-blur-md rounded-full p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0 shadow-xl">
                                        <ArrowLeft className="w-6 h-6 text-white rotate-180" style={{ transform: "rotate(45deg)" }} /> {/* Minimalist Zoom Icon Mock */}
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>

                {/* Details Section */}
                <div className="flex flex-col justify-center space-y-10">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        {!currentUser && (
                            <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-neon-pink/10 to-neon-purple/10 border border-white/10 flex items-center justify-between gap-4">
                                <p className="text-white/70 text-sm">
                                    <span className="text-white font-semibold">Guest Mode:</span> You are viewing this artwork as a guest. 
                                    Sign in for the full immersive experience.
                                </p>
                                <Link href="/auth/login">
                                    <Button className="bg-white text-black hover:bg-white/90 rounded-full h-8 px-4 py-0 text-xs shadow-none">
                                        Sign In
                                    </Button>
                                </Link>
                            </div>
                        )}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter mb-4 text-glow text-white leading-tight">{art.title}</h1>
                                <p className="text-2xl text-white/80 font-medium">by {art.artist}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 mb-8">
                            <button 
                                onClick={() => {
                                    if (!currentUser) {
                                        toast.error("Please sign in to like artworks.");
                                        return;
                                    }
                                    setIsLiked(!isLiked);
                                }} 
                                className={`p-4 rounded-full border border-white/10 glass-card bg-black/20 hover:bg-black/40 transition-colors shadow-none ${isLiked ? 'text-neon-pink border-neon-pink/30' : 'text-white'}`}
                            >
                                <Heart className={`h-6 w-6 ${isLiked ? 'fill-neon-pink' : ''}`} />
                            </button>
                            <button 
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    toast.success("Link copied to clipboard!");
                                }}
                                className="p-4 rounded-full border border-white/10 glass-card bg-black/20 hover:bg-black/40 text-white transition-colors shadow-none"
                            >
                                <Share2 className="h-6 w-6" />
                            </button>
                        </div>

                        <p className="text-white/60 text-lg leading-relaxed border-l-4 border-white/10 pl-6 lg:ml-2 py-2 max-w-lg">{art.desc}</p>
                    </motion.div>

                    {/* Music Player Maps */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        {art.hasMusic && art.audioTracks && art.audioTracks.length > 0 ? (
                            <div className="space-y-6">
                                {art.audioTracks.map((track: any, idx: number) => (
                                    <div key={idx}>
                                        <Card className="bg-black/80 border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] p-0 overflow-hidden relative">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-neon-pink/10 to-neon-cyan/10 pointer-events-none" />
                                            <div className="p-8 relative z-10">
                                                <div className="flex items-start gap-5 mb-6">
                                                    <div className="w-16 h-16 rounded-2xl bg-black flex flex-shrink-0 items-center justify-center border border-white/10 shadow-[0_0_20px_rgba(255,42,133,0.3)] overflow-hidden relative">
                                                        {playingIndex === idx && <div className="absolute inset-0 bg-neon-pink/20 animate-pulse" />}
                                                        <Volume2 className={`h-7 w-7 text-neon-pink relative z-10 transition-transform ${playingIndex === idx ? 'scale-110' : ''}`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-white font-bold text-xl truncate leading-tight mb-1">Sonic Environment {idx + 1}</h4>
                                                        <p className="text-white/50 text-base">{art.artist} Originals</p>
                                                    </div>
                                                    {isOwner && (
                                                        <button
                                                            type="button"
                                                            title="Remove this track"
                                                            disabled={removingIndex !== null}
                                                            onClick={async () => {
                                                                if (!confirm("Remove this music from your artwork?")) return;
                                                                setRemovingIndex(idx);
                                                                try {
                                                                    await removeMusicTrack(id, idx);
                                                                    setPlayingIndex(null);
                                                                    toast.success("Music removed from your artwork.");
                                                                } catch (err) {
                                                                    toast.error(err instanceof Error ? err.message : "Could not remove track.");
                                                                } finally {
                                                                    setRemovingIndex(null);
                                                                }
                                                            }}
                                                            className="shrink-0 p-2.5 rounded-xl border border-white/15 text-white/50 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                </div>

                                                {track.type === "youtube" ? (
                                                    <div className="aspect-video w-full rounded-xl overflow-hidden mt-2 relative z-20">
                                                        <iframe src={`https://www.youtube.com/embed/${track.url?.split("v=")[1]?.split("&")[0] || track.url?.split("youtu.be/")[1]}`} className="w-full h-full" allowFullScreen></iframe>
                                                    </div>
                                                ) : track.type === "spotify" ? (
                                                    <div className="w-full h-36 rounded-xl overflow-hidden mt-2 relative z-20">
                                                        <iframe src={track.url?.replace("spotify.com/", "spotify.com/embed/")} className="w-full h-full" allow="encrypted-media"></iframe>
                                                    </div>
                                                ) : track.type === "soundcloud" ? (
                                                    <div className="w-full h-[166px] rounded-xl overflow-hidden mt-2 relative z-20">
                                                        <iframe scrolling="no" frameBorder="no" allow="autoplay" src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(track.url || '')}&color=%23ff2a85&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`} className="w-full h-full"></iframe>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {/* Native HTML5 Audio Element Hidden */}
                                                        {track.type === "upload" && track.url && (
                                                            <audio id={`audio-${art.id}-${idx}`} src={track.url} className="hidden" onEnded={() => setPlayingIndex(null)} onPlay={() => setPlayingIndex(idx)} onPause={() => setPlayingIndex(null)}></audio>
                                                        )}

                                                        {/* Progress Bar Mock */}
                                                        <div className="space-y-3 mb-8 px-2 mt-4 relative z-20">
                                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden cursor-pointer relative">
                                                                <motion.div
                                                                    className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-neon-pink to-neon-cyan w-1/3"
                                                                >
                                                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#fff]" />
                                                                </motion.div>
                                                            </div>
                                                            <div className="flex justify-between text-xs text-white/50 font-mono">
                                                                <span>1:24</span>
                                                                <span>3:45</span>
                                                            </div>
                                                        </div>

                                                        {/* Controls */}
                                                        <div className="flex justify-center items-center gap-10 relative z-20">
                                                            <button className="text-white/40 hover:text-white transition-colors hover:scale-110 active:scale-95">
                                                                <SkipBack className="h-8 w-8 fill-current" />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    const audio = document.getElementById(`audio-${art.id}-${idx}`) as HTMLAudioElement;
                                                                    if (audio) {
                                                                        if (playingIndex === idx) { audio.pause(); setPlayingIndex(null); }
                                                                        else { 
                                                                            document.querySelectorAll('audio').forEach(a => a.pause());
                                                                            audio.play(); 
                                                                            setPlayingIndex(idx); 
                                                                        }
                                                                    } else {
                                                                        setPlayingIndex(playingIndex === idx ? null : idx);
                                                                    }
                                                                }}
                                                                className="w-20 h-20 items-center justify-center flex rounded-full bg-white text-black hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all active:scale-95"
                                                            >
                                                                {playingIndex === idx ? <PauseCircle className="h-10 w-10 fill-current" /> : <PlayCircle className="h-10 w-10 fill-current ml-1" />}
                                                            </button>
                                                            <button className="text-white/40 hover:text-white transition-colors hover:scale-110 active:scale-95">
                                                                <SkipForward className="h-8 w-8 fill-current" />
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </Card>
                                    </div>
                                ))}

                                {isOwner && art.audioTracks.length < 3 && (
                                    <div className="text-center mt-6">
                                        <Link href={`/dashboard/artwork/${id}/add-music`}>
                                            <Button variant="outline" className="text-neon-cyan border-neon-cyan/50 hover:bg-neon-cyan/10">
                                                + Add Another Track ({art.audioTracks.length}/3)
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-10 rounded-3xl border border-dashed border-white/20 bg-black/20 text-center">
                                <MusicIcon className="h-12 w-12 text-white/20 mx-auto mb-4" />
                                <p className="text-white/50 mb-6 text-lg">No audio experience linked to this artwork.</p>
                                {isOwner ? (
                                    <Link href={`/dashboard/artwork/${id}/add-music`}>
                                        <Button className="border-none bg-neon-cyan text-black hover:bg-neon-cyan/80 shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                                            Link Spotify / Upload Audio
                                        </Button>
                                    </Link>
                                ) : (
                                    <p className="text-white/30 text-sm italic">Only the creator can add music to this artwork.</p>
                                )}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
        </>
    );
}

function MusicIcon({ className }: { className: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
        </svg>
    );
}
