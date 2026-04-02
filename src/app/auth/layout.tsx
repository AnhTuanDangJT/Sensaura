import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Background blurs */}
            <div className="flex-1 hidden lg:flex flex-col items-center justify-center bg-black/5 dark:bg-black relative overflow-hidden">
                <div className="absolute -top-[20%] -right-[10%] w-[700px] h-[500px] bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_60%)] rounded-full transform-gpu" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_60%)] rounded-full transform-gpu" />
            </div>

            <div className="absolute top-8 left-8 z-20">
                <Link href="/" className="inline-flex items-center text-sm text-foreground/60 hover:text-foreground transition-colors group">
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to home
                </Link>
            </div>

            {/* Main Content container */}
            <div className="w-full max-w-md space-y-8 relative z-10">
                {children}
            </div>
        </div>
    );
}
