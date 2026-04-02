import { cn } from "@/lib/utils";
import React from "react";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("glass-card", className)}
            {...props}
        />
    )
);
Card.displayName = "Card";
