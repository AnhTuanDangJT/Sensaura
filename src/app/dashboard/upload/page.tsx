"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { UploadCloud, Image as ImageIcon, X, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function UploadArtPage() {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { addArtwork } = useStore();

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please select a file to upload.");
            return;
        }

        const titleInput = (e.currentTarget.elements.namedItem("title") as HTMLInputElement).value;
        const descInput = (e.currentTarget.elements.namedItem("description") as HTMLTextAreaElement).value;

        setIsLoading(true);

        // Parse file to Base64 to save exactly what the user uploaded
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64Data = event.target?.result as string;
            
            setTimeout(() => {
                setIsLoading(false);
                const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
                
                // Add artwork to global state natively
                addArtwork({
                    title: titleInput,
                    image: base64Data, // Save actual file contents
                    fileType: isPdf ? "pdf" : "image",
                    desc: descInput
                });

                toast.success("Artwork submitted for admin review!");
                router.push("/dashboard/my-art");
            }, 1000); // UI visual timeout
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 mt-10">
            <header className="text-center sm:text-left">
                <h1 className="text-4xl font-bold tracking-tight mb-2 text-glow text-white">Upload Artwork</h1>
                <p className="text-foreground/70">Submit your visual masterpiece or PDF portfolio to the gallery for review.</p>
            </header>

            <Card className="p-8 glass-card border-[rgba(255,255,255,0.05)] bg-black/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(255,42,133,0.1)_0%,transparent_60%)] rounded-full pointer-events-none transform-gpu" />

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div
                        className={`border-2 border-dashed rounded-2xl transition-all duration-300 flex flex-col items-center justify-center py-16 px-4 text-center cursor-pointer ${dragActive ? "border-neon-pink bg-neon-pink/5" : "border-white/10 hover:border-white/20 hover:bg-white/5"
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById("file-upload")?.click()}
                    >
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            onChange={handleChange}
                        />

                        {file ? (
                            <div className="space-y-4">
                                <div className="w-20 h-20 bg-neon-pink/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(255,42,133,0.4)]">
                                    {(file.type === "application/pdf" || file.name.endsWith(".pdf")) ? (
                                        <FileText className="h-10 w-10 text-neon-pink" />
                                    ) : (
                                        <ImageIcon className="h-10 w-10 text-neon-pink" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-white font-medium">{file.name}</p>
                                    <p className="text-white/50 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10 mt-2 px-4 py-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFile(null);
                                    }}
                                >
                                    <X className="h-4 w-4 mr-2" /> Remove File
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/50">
                                    <UploadCloud className="h-8 w-8" />
                                </div>
                                <div>
                                    <p className="text-lg font-medium mb-1 text-white">Drag & drop your artwork</p>
                                    <p className="text-sm text-foreground/50">High-res PNG, JPG, WEBP, or PDF up to 20MB</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium mb-2 text-white/80">
                                Artwork Title
                            </label>
                            <Input
                                id="title"
                                name="title"
                                required
                                placeholder="E.g. Neon Horizon"
                                className="bg-black/50 border-white/10 text-white focus-visible:border-neon-pink focus-visible:ring-neon-pink/20 h-14"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium mb-2 text-white/80">
                                Story / Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                required
                                rows={4}
                                placeholder="What inspired bringing this piece to life?"
                                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink/20 focus-visible:border-neon-pink transition-all resize-none"
                            />
                        </div>
                    </div>

                    <Button type="submit" isLoading={isLoading} className="w-full h-14 text-lg bg-neon-pink hover:bg-neon-pink/90 text-white shadow-[0_0_20px_rgba(255,42,133,0.3)] hover:shadow-[0_0_30px_rgba(255,42,133,0.5)] border-none">
                        Submit for Review
                    </Button>
                </form>
            </Card>
        </div>
    );
}
