"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

export function OnboardingModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Simulate first login by showing after a short delay on the dashboard
        const timer = setTimeout(() => {
            const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
            if (!hasSeenOnboarding) {
                setIsOpen(true);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("hasSeenOnboarding", "true");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="relative w-full max-w-lg z-10"
                    >
                        <Card className="p-8 pb-10 shadow-2xl overflow-hidden glass border-white/20">
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 blur-[80px] rounded-full pointer-events-none" />

                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors z-20"
                                aria-label="Close modal"
                            >
                                <X className="h-5 w-5 text-foreground/50" />
                            </button>

                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-black/5 dark:bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-black/10 dark:border-white/10 shadow-inner">
                                    <Sparkles className="h-7 w-7 opacity-80" />
                                </div>

                                <h2 className="text-3xl font-bold tracking-tight mb-4">
                                    Welcome to your new workspace
                                </h2>
                                <p className="text-foreground/70 mb-8 leading-relaxed text-lg">
                                    We&apos;ve designed every pixel to help you focus and create your best work.
                                    Take a quick tour to discover how our intelligent tools can accelerate your workflow.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button className="flex-1 h-12 text-base" onClick={handleClose}>
                                        Start Exploring
                                    </Button>
                                    <Button variant="ghost" className="flex-1 h-12 text-base" onClick={handleClose}>
                                        Skip for now
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
