"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type User = {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "USER";
};

export type Artwork = {
    id: string;
    title: string;
    artist: string;
    status: "Approved" | "Pending" | "Rejected";
    hasMusic: boolean;
    image: string;
    userEmail: string;
    fileType?: "image" | "pdf";
    audioTracks?: { url: string; type: "link" | "upload" | "youtube" | "spotify" | "soundcloud" }[];
    desc?: string;
};

type StoreContextType = {
    currentUser: User | null;
    users: User[];
    artworks: Artwork[];
    login: (email: string) => void;
    logout: () => void;
    approveArtwork: (id: string) => void;
    rejectArtwork: (id: string) => void;
    addArtwork: (artwork: Pick<Artwork, "title" | "image" | "fileType" | "desc">) => void;
    deleteArtwork: (id: string) => void;
    linkMusic: (id: string, url: string, type: string) => void;
};

const StoreContext = createContext<StoreContextType | null>(null);

const INITIAL_USERS: User[] = [
    { id: "1", name: "Anh Tuan", email: "dganhtuan.2k5@gmail.com", role: "ADMIN" },
    { id: "2", name: "CyberJane", email: "jane@example.com", role: "USER" },
    { id: "3", name: "JohnDoe", email: "john@example.com", role: "USER" },
    { id: "4", name: "AudioVisual", email: "av@example.com", role: "USER" },
];

const INITIAL_ARTWORKS: Artwork[] = [
    { id: "1", title: "Neon Nights", artist: "CyberJane", status: "Approved", hasMusic: true, image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop", userEmail: "jane@example.com", fileType: "image" },
    { id: "2", title: "Abstract Thoughts", artist: "JohnDoe", status: "Pending", hasMusic: false, image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2670&auto=format&fit=crop", userEmail: "john@example.com", fileType: "image" },
    { id: "3", title: "Sonic Landscape", artist: "AudioVisual", status: "Approved", hasMusic: true, image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop", userEmail: "av@example.com", fileType: "image" },
    { id: "4", title: "Ethereal Dream", artist: "Dreamer", status: "Approved", hasMusic: true, image: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2679&auto=format&fit=crop", userEmail: "dreamer@example.com", fileType: "image" },
    { id: "5", title: "Chromatic Aberration", artist: "Colorist", status: "Pending", hasMusic: false, image: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=2574&auto=format&fit=crop", userEmail: "colorist@example.com", fileType: "image" },
];

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users] = useState<User[]>(INITIAL_USERS);
    const [artworks, setArtworks] = useState<Artwork[]>(INITIAL_ARTWORKS);

    // Persist session artificially for demo
    useEffect(() => {
        const stored = localStorage.getItem("sensaura_user");
        if (stored) {
            try { setCurrentUser(JSON.parse(stored)); } catch (e) {}
        } else {
            // Force admin login for the exercise initially
            setCurrentUser(INITIAL_USERS[0]);
        }
    }, []);

    const login = (email: string) => {
        const user = users.find(u => u.email === email);
        if (user) {
            setCurrentUser(user);
            localStorage.setItem("sensaura_user", JSON.stringify(user));
        } else {
            // Fake user creation
            const newUser: User = { id: Math.random().toString(), name: email.split("@")[0], email, role: "USER" };
            setCurrentUser(newUser);
            localStorage.setItem("sensaura_user", JSON.stringify(newUser));
        }
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem("sensaura_user");
    };

    const approveArtwork = (id: string) => {
        setArtworks(prev => prev.map(art => art.id === id ? { ...art, status: "Approved" } : art));
    };
    
    const rejectArtwork = (id: string) => {
        setArtworks(prev => prev.map(art => art.id === id ? { ...art, status: "Rejected" } : art));
    };

    const deleteArtwork = (id: string) => {
        setArtworks(prev => prev.filter(art => art.id !== id));
    };

    const linkMusic = (id: string, url: string, type: string) => {
        setArtworks(prev => prev.map(art => {
            if (art.id === id) {
                const tracks = art.audioTracks || [];
                if (tracks.length >= 3) return art; // Safety max bound
                return { ...art, hasMusic: true, audioTracks: [...tracks, { url, type: type as any }] };
            }
            return art;
        }));
    };

    const addArtwork = (opts: Pick<Artwork, "title" | "image" | "fileType" | "desc">) => {
        if (!currentUser) return;
        const newArt: Artwork = {
            id: Math.random().toString(),
            title: opts.title,
            artist: currentUser.name,
            status: "Pending",
            hasMusic: false,
            image: opts.image,
            userEmail: currentUser.email,
            fileType: opts.fileType || "image",
            desc: opts.desc || ""
        };
        setArtworks(prev => [newArt, ...prev]);
    };

    return (
        <StoreContext.Provider value={{ currentUser, users, artworks, login, logout, approveArtwork, rejectArtwork, addArtwork, deleteArtwork, linkMusic }}>
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    const ctx = useContext(StoreContext);
    if (!ctx) throw new Error("useStore must be used within StoreProvider");
    return ctx;
}
