"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User, Artwork } from "./models";
import { parseError } from "./api-client";

export type { User, Artwork };

type StoreContextType = {
    currentUser: User | null;
    users: User[];
    artworks: Artwork[];
    hydrated: boolean;
    serverConfigured: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshArtworks: () => Promise<void>;
    fetchUsers: () => Promise<void>;
    approveArtwork: (id: string) => Promise<void>;
    rejectArtwork: (id: string) => Promise<void>;
    deleteArtwork: (id: string) => Promise<void>;
    linkMusic: (id: string, data: string | File, type: string) => Promise<void>;
};

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [hydrated, setHydrated] = useState(false);
    const [serverConfigured, setServerConfigured] = useState(true);

    const refreshArtworks = useCallback(async () => {
        const res = await fetch("/api/artworks", { credentials: "include" });
        const data = (await res.json()) as { artworks?: Artwork[]; configured?: boolean };
        if (data.configured === false) setServerConfigured(false);
        if (data.artworks) setArtworks(data.artworks);
    }, []);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const meRes = await fetch("/api/auth/me", { credentials: "include" });
                let me: { user: User | null; configured?: boolean };
                try {
                    me = (await meRes.json()) as typeof me;
                } catch {
                    if (!cancelled) setServerConfigured(false);
                    return;
                }
                if (cancelled) return;
                if (me.configured === false) setServerConfigured(false);
                if (me.user) setCurrentUser(me.user);

                const artRes = await fetch("/api/artworks", { credentials: "include" });
                try {
                    const artData = (await artRes.json()) as { artworks?: Artwork[]; configured?: boolean };
                    if (cancelled) return;
                    if (artData.configured === false) setServerConfigured(false);
                    if (artData.artworks) setArtworks(artData.artworks);
                } catch {
                    if (!cancelled) setServerConfigured(false);
                }
            } finally {
                if (!cancelled) setHydrated(true);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const login = async (email: string, password: string) => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });
        if (!res.ok) throw new Error(await parseError(res));
        const data = (await res.json()) as { user: User };
        setCurrentUser(data.user);
        await refreshArtworks();
    };

    const register = async (name: string, email: string, password: string) => {
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
            credentials: "include",
        });
        if (!res.ok) throw new Error(await parseError(res));
        const data = (await res.json()) as { user: User };
        setCurrentUser(data.user);
        await refreshArtworks();
    };

    const logout = async () => {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        setCurrentUser(null);
        setUsers([]);
        setArtworks([]);
        await refreshArtworks();
    };

    const fetchUsers = useCallback(async () => {
        const res = await fetch("/api/users", { credentials: "include" });
        if (!res.ok) return;
        const data = (await res.json()) as { users?: User[] };
        if (data.users) setUsers(data.users);
    }, []);

    const approveArtwork = async (id: string) => {
        const res = await fetch(`/api/artworks/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "approve" }),
            credentials: "include",
        });
        if (!res.ok) throw new Error(await parseError(res));
        await refreshArtworks();
    };

    const rejectArtwork = async (id: string) => {
        const res = await fetch(`/api/artworks/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "reject" }),
            credentials: "include",
        });
        if (!res.ok) throw new Error(await parseError(res));
        await refreshArtworks();
    };

    const deleteArtwork = async (id: string) => {
        const res = await fetch(`/api/artworks/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        if (!res.ok) throw new Error(await parseError(res));
        await refreshArtworks();
    };

    const linkMusic = async (id: string, data: string | File, type: string) => {
        if (type === "upload" && data instanceof File) {
            const fd = new FormData();
            fd.append("file", data);
            const res = await fetch(`/api/artworks/${id}/music`, {
                method: "POST",
                body: fd,
                credentials: "include",
            });
            if (!res.ok) throw new Error(await parseError(res));
        } else {
            const res = await fetch(`/api/artworks/${id}/music`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ link: data }),
                credentials: "include",
            });
            if (!res.ok) throw new Error(await parseError(res));
        }
        await refreshArtworks();
    };

    return (
        <StoreContext.Provider
            value={{
                currentUser,
                users,
                artworks,
                hydrated,
                serverConfigured,
                login,
                register,
                logout,
                refreshArtworks,
                fetchUsers,
                approveArtwork,
                rejectArtwork,
                deleteArtwork,
                linkMusic,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    const ctx = useContext(StoreContext);
    if (!ctx) throw new Error("useStore must be used within StoreProvider");
    return ctx;
}
