"use client";

import { useStore } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function DashboardAuthGate({ children }: { children: React.ReactNode }) {
    const { currentUser, hydrated, serverConfigured } = useStore();
    const router = useRouter();

    const pathname = usePathname();

    useEffect(() => {
        if (!hydrated) return;
        if (!serverConfigured) return;
        
        // Allowed public routes in dashboard
        const isPublicRoute = pathname === "/dashboard" || pathname?.startsWith("/dashboard/artwork/");
        if (isPublicRoute) return;

        if (!currentUser) {
            router.replace("/auth/login");
        }
    }, [hydrated, serverConfigured, currentUser, router, pathname]);

    if (!hydrated) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#050505] text-white">
                <div className="h-10 w-10 border-2 border-neon-pink border-t-transparent rounded-full animate-spin" />
                <p className="text-white/60 text-sm">Loading your studio…</p>
            </div>
        );
    }

    if (!serverConfigured) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#050505] text-white p-6 text-center max-w-lg mx-auto">
                <p className="text-lg font-medium text-white">Backend not configured</p>
                <p className="text-white/60 text-sm">
                    Add the variables from <code className="text-neon-cyan">.env.example</code> to{" "}
                    <code className="text-neon-cyan">.env.local</code>, then restart the dev server.
                </p>
            </div>
        );
    }

    if (!currentUser) {
        const isPublicRoute = pathname === "/dashboard" || pathname?.startsWith("/dashboard/artwork/");
        if (isPublicRoute) {
            return <>{children}</>;
        }

        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#050505] text-white">
                <div className="h-10 w-10 border-2 border-neon-pink border-t-transparent rounded-full animate-spin" />
                <p className="text-white/60 text-sm">Redirecting to sign in…</p>
            </div>
        );
    }

    return <>{children}</>;
}
