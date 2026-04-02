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
];

const INITIAL_ARTWORKS: Artwork[] = [];

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users] = useState<User[]>(INITIAL_USERS);
    const [artworks, setArtworks] = useState<Artwork[]>(INITIAL_ARTWORKS);
    const [isLoaded, setIsLoaded] = useState(false);

    // Persist session artificially for demo
    useEffect(() => {
        const stored = localStorage.getItem("sensaura_user");
        if (stored) {
            try { setCurrentUser(JSON.parse(stored)); } catch (e) {}
        } else {
            // Force admin login for the exercise initially
            setCurrentUser(INITIAL_USERS[0]);
        }

        // Load persisted artworks
        const storedArt = localStorage.getItem("sensaura_artworks");
        if (storedArt && storedArt !== "[]") {
            try { setArtworks(JSON.parse(storedArt)); } catch (e) {}
        }
        setIsLoaded(true);
    }, []);

    // Sync artworks to local storage whenever a user modifies them
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("sensaura_artworks", JSON.stringify(artworks));
        }
    }, [artworks, isLoaded]);

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
