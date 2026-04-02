"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Successfully logged in!");
            router.push("/dashboard");
        }, 1500);
    };

    return (
        <Card className="w-full relative overflow-hidden backdrop-blur-3xl glass shadow-[0_32px_64px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_rgba(0,0,0,0.4)] border-white/20">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 opacity-50" />

            <div className="relative z-10 p-4">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h2>
                    <p className="text-sm text-foreground/60">
                        Enter your credentials to access your workspace.
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
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
                                autoComplete="current-password"
                                required
                                placeholder="••••••••"
                                className="bg-black/5 dark:bg-black/20 focus:bg-transparent transition-all"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-black/20 bg-transparent accent-foreground"
                                disabled={isLoading}
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm opacity-80">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link href="#" className="font-medium hover:underline opacity-80 hover:opacity-100 transition-opacity">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <Button type="submit" isLoading={isLoading} className="w-full mt-4 h-12 text-base shadow-lg">
                        Sign in
                    </Button>
                </form>

                <p className="mt-8 text-center text-sm opacity-60">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/register" className="font-medium hover:underline opacity-100 transition-opacity">
                        Register now
                    </Link>
                </p>
            </div>
        </Card>
    );
}
