import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { DashboardAuthGate } from "@/components/dashboard/DashboardAuthGate";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard - Muse" };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardAuthGate>
            <div className="flex h-screen overflow-hidden bg-background selection:bg-black/10 dark:selection:bg-white/10 selection:text-foreground">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    <Topbar />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-black/[0.02] pb-16 md:pb-0">
                        <div className="container mx-auto p-4 md:p-6 max-w-7xl min-h-full">
                            {children}
                        </div>
                    </main>
                </div>
                <MobileNav />
                <OnboardingModal />
            </div>
        </DashboardAuthGate>
    );
}
