"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, PlayCircle, Music, Link as LinkIcon, UploadCloud, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";

export default function AddMusicPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"link" | "upload">("link");
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const { artworks, linkMusic } = useStore();

    const storeArt = artworks.find(a => a.id === id);
    const hasMaxTracks = storeArt?.audioTracks ? storeArt.audioTracks.length >= 3 : false;

    const getAudioType = (url: string) => {
        if (url.includes("spotify.com")) return "spotify";
        if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
        if (url.includes("soundcloud.com")) return "soundcloud";
        return "link";
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (activeTab === "upload" && !file) {
            toast.error("Please provide an audio file.");
            return;
        }

        setIsLoading(true);

        try {
            if (activeTab === "upload" && file) {
                await linkMusic(id, file, "upload");
            } else {
                const linkInput = (e.currentTarget.elements.namedItem("link") as HTMLInputElement)?.value;
                if (!linkInput) {
                    toast.error("Please provide a valid URL.");
                    setIsLoading(false);
                    return;
                }
                const type = getAudioType(linkInput);
                await linkMusic(id, linkInput, type);
            }
            toast.success("Sonic experience successfully linked!");
            router.push(`/dashboard/artwork/${id}`);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not save music.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto pb-20 mt-4">
            <Link href="/dashboard/my-art" className="inline-flex items-center text-white/50 hover:text-white mb-8 group transition-colors uppercase font-bold text-xs tracking-widest">
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Portfolio
            </Link>

            <header className="mb-10 text-center sm:text-left">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan shadow-[0_0_20px_rgba(0,243,255,0.2)] mb-6">
                    <Music className="h-8 w-8" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight mb-3 text-white text-glow">Add Music</h1>
                <p className="text-foreground/60 text-lg">
                    Enhance your artwork with a sonic dimension. Link an external track or upload an original composition.
                </p>
            </header>

            <Card className="glass-card border-white/5 bg-black p-0 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="flex border-b border-white/10 bg-white/[0.02]">
                    <button
                        type="button"
                        onClick={() => setActiveTab("link")}
                        className={`flex-1 py-5 flex items-center justify-center gap-2 font-medium transition-colors ${activeTab === "link" ? "text-neon-cyan bg-neon-cyan/5 border-b-2 border-neon-cyan" : "text-white/50 hover:text-white hover:bg-white/5"}`}
                    >
                        <LinkIcon className="h-4 w-4" /> Embed Link
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("upload")}
                        className={`flex-1 py-5 flex items-center justify-center gap-2 font-medium transition-colors ${activeTab === "upload" ? "text-neon-cyan bg-neon-cyan/5 border-b-2 border-neon-cyan" : "text-white/50 hover:text-white hover:bg-white/5"}`}
                    >
                        <UploadCloud className="h-4 w-4" /> Upload File
                    </button>
                </div>

                <div className="p-8">
                    {hasMaxTracks ? (
                        <div className="text-center bg-neon-pink/10 border border-neon-pink/20 rounded-2xl p-10">
                            <h3 className="text-neon-pink font-bold text-2xl mb-2">Maximum Tracks Reached</h3>
                            <p className="text-white/60">This artwork already has the maximum of 3 sonic experiences attached.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <AnimatePresence mode="wait">
                                {activeTab === "link" ? (
                                    <motion.div
                                        key="link"
                                        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                        exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-3"
                                    >
                                        <label className="block text-sm font-medium mb-2 text-white/80">Spotify or YouTube URL</label>
                                        <Input
                                            id="link"
                                            name="link"
                                            required
                                            placeholder="https://open.spotify.com/track/..."
                                            className="flex-1 bg-black/40 border-white/10 text-white focus-visible:border-neon-cyan focus-visible:ring-neon-cyan/20 h-14 text-base"
                                        />
                                        <p className="text-sm text-white/40 mt-3 flex items-center gap-1.5">
                                            <PlayCircle className="h-4 w-4 text-neon-cyan" /> Direct links will auto-map to our custom visualizer engine.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="upload"
                                        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                        exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <label className="block text-sm font-medium mb-3 text-white/80">Audio File (MP3, WAV)</label>
                                        <div
                                            className="border-2 border-dashed border-white/20 bg-black/40 rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:bg-white/5 hover:border-neon-cyan/50 transition-colors cursor-pointer relative group"
                                            onClick={() => document.getElementById('audio-upload')?.click()}
                                        >
                                            <input
                                                id="audio-upload"
                                                type="file"
                                                accept="audio/*"
                                                className="hidden"
                                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                            />
                                            {file ? (
                                                <div className="flex flex-col items-center">
                                                    <div className="w-14 h-14 bg-neon-cyan/20 rounded-full flex items-center justify-center text-neon-cyan mb-4 border border-neon-cyan/30 shadow-[0_0_15px_rgba(0,243,255,0.2)]">
                                                        <CheckCircle2 className="h-7 w-7" />
                                                    </div>
                                                    <p className="text-white font-medium text-lg mb-1">{file.name}</p>
                                                    <p className="text-white/40 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready to embed</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                                        <UploadCloud className="h-8 w-8 text-neon-cyan" />
                                                    </div>
                                                    <p className="text-white/90 font-medium mb-2 text-lg">Click or drag audio file here</p>
                                                    <p className="text-white/40 text-sm">Max size 50MB. High quality recommended.</p>
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <Button
                                type="submit"
                                isLoading={isLoading}
                                className="w-full h-14 text-lg bg-neon-cyan hover:bg-neon-cyan/90 text-black shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] border-none mt-8 font-bold"
                            >
                                Add Sonic Experience
                            </Button>
                        </form>
                    )}
                </div>
            </Card>
        </div>
    );
}
