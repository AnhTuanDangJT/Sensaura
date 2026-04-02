"use client";

import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import { Check, X, ShieldAlert, Users, Trash2, ShieldCheck, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboardPage() {
    const { currentUser, artworks, users, approveArtwork, rejectArtwork, deleteArtwork } = useStore();
    const router = useRouter();

    useEffect(() => {
        // Protect route
        if (currentUser && currentUser.role !== "ADMIN") {
            router.push("/dashboard");
        }
    }, [currentUser, router]);

    if (!currentUser || currentUser.role !== "ADMIN") return null;

    const pendingArtworks = artworks.filter(art => art.status === "Pending");
    const approvedArtworks = artworks.filter(art => art.status === "Approved");

    return (
        <div className="space-y-16">
            <header className="mb-10 text-center sm:text-left">
                <h1 className="text-4xl font-bold tracking-tight mb-3 text-white flex items-center gap-3">
                    <ShieldAlert className="w-8 h-8 text-neon-pink" /> 
                    Verification Queue
                </h1>
                <p className="text-foreground/70 text-lg max-w-2xl">
                    Review and verify posts from clients before they appear in the public Gallery.
                </p>
            </header>

            <section>
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                    Pending Artworks <span className="bg-neon-pink/20 text-neon-pink text-sm px-2 py-0.5 rounded-full">{pendingArtworks.length}</span>
                </h2>
                
                {pendingArtworks.length === 0 ? (
                    <div className="p-8 border border-white/10 border-dashed rounded-2xl flex flex-col items-center justify-center text-white/50 bg-black/20">
                        <Check className="w-12 h-12 mb-4 text-white/20" />
                        <p>All caught up! No pending artworks to verify.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pendingArtworks.map((art, i) => (
                            <motion.div 
                                key={art.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"
                            >
                                <div className="w-full sm:w-32 aspect-square rounded-xl overflow-hidden shrink-0">
                                    <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{art.title}</h3>
                                        <p className="text-white/60 text-sm mb-1">by <span className="text-neon-cyan">{art.artist}</span> ({art.userEmail})</p>
                                    </div>
                                    <div className="flex items-center gap-3 mt-4 sm:mt-0">
                                        <button 
                                            onClick={() => approveArtwork(art.id)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-[#00ff88]/20 hover:bg-[#00ff88]/30 text-[#00ff88] border border-[#00ff88]/30 transition-all font-medium text-sm"
                                        >
                                            <Check className="w-4 h-4" /> Approve
                                        </button>
                                        <button 
                                            onClick={() => rejectArtwork(art.id)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-all font-medium text-sm"
                                        >
                                            <X className="w-4 h-4" /> Reject
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            <section className="pt-8 border-t border-white/10">
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                    Manage Public Artworks
                </h2>
                
                {approvedArtworks.length === 0 ? (
                    <div className="p-8 border border-white/10 border-dashed rounded-2xl flex flex-col items-center justify-center text-white/50 bg-black/20">
                        <Check className="w-12 h-12 mb-4 text-white/20" />
                        <p>No public artworks found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {approvedArtworks.map((art, i) => (
                            <motion.div 
                                key={art.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"
                            >
                                <div className="w-full sm:w-32 aspect-[4/3] rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-black/50">
                                    {art.fileType === "pdf" ? (
                                        <FileText className="w-10 h-10 text-white/40" />
                                    ) : (
                                        <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{art.title}</h3>
                                        <p className="text-white/60 text-sm mb-1">by <span className="text-neon-cyan">{art.artist}</span></p>
                                    </div>
                                    <div className="flex items-center mt-4 sm:mt-0">
                                        <button 
                                            onClick={() => deleteArtwork(art.id)}
                                            className="w-full sm:w-auto flex items-center justify-center gap-2 py-2 px-6 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all font-medium text-sm"
                                        >
                                            <Trash2 className="w-4 h-4" /> Delete Public Post
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            <section className="pt-8 border-t border-white/10">
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                    <Users className="w-6 h-6 text-neon-cyan" /> User Tracking
                </h2>
                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
                    <table className="w-full text-left text-sm text-white/70">
                        <thead className="bg-white/5 border-b border-white/10 text-white font-medium">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-white font-medium">{user.name}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-neon-pink/20 text-neon-pink' : 'bg-white/10 text-white/70'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
