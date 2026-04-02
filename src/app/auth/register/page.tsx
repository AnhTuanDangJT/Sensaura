"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;

        if (password.length < 8) {
            setIsLoading(false);
            toast.error("Password must be at least 8 characters long.");
            return;
        }

        setTimeout(() => {
            setIsLoading(false);
            toast.success("Account created successfully!");
            router.push("/dashboard");
        }, 1500);
    };

    return (
        <Card className="w-full relative overflow-hidden backdrop-blur-3xl glass shadow-[0_32px_64px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_rgba(0,0,0,0.4)] border-white/20">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 opacity-50" />

            <div className="relative z-10 p-4">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Create account</h2>
                    <p className="text-sm text-foreground/60">
                        Join thousands of creators and elevate your workflow.
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleRegister}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1.5 opacity-80">
                                Full Name
                            </label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                placeholder="Jane Doe"
                                className="bg-black/5 dark:bg-black/20 focus:bg-transparent transition-all"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1.5 opacity-80">
                                Email address
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="you@example.com"
                                className="bg-black/5 dark:bg-black/20 focus:bg-transparent transition-all"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-1.5 opacity-80">
                                Password
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                placeholder="Create a strong password"
                                className="bg-black/5 dark:bg-black/20 focus:bg-transparent transition-all"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <Button type="submit" isLoading={isLoading} className="w-full mt-6 h-12 text-base shadow-lg">
                        Create account
                    </Button>
                </form>

                <p className="mt-8 text-center text-sm opacity-60">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="font-medium hover:underline opacity-100 transition-opacity">
                        Sign in
                    </Link>
                </p>
            </div>
        </Card>
    );
}
