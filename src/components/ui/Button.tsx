import { cn } from "@/lib/utils";
import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", isLoading, children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={isLoading || disabled}
                className={cn(
                    "inline-flex items-center justify-center rounded-xl text-[15px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none px-6 py-3",
                    variant === "primary" && "bg-foreground text-background hover:shadow-lg hover:bg-foreground/90",
                    variant === "secondary" && "bg-black/5 dark:bg-white/10 text-foreground hover:bg-black/10 dark:hover:bg-white/20",
                    variant === "outline" && "border border-black/10 dark:border-white/10 glass hover:bg-black/5 dark:hover:bg-white/5",
                    variant === "ghost" && "hover:bg-black/5 dark:hover:bg-white/10",
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";
