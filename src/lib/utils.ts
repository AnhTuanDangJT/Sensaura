import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/** Case-insensitive match for artwork owner vs session email. */
export function sameEmail(a: string | undefined, b: string | undefined): boolean {
    const x = a?.toLowerCase().trim() ?? "";
    const y = b?.toLowerCase().trim() ?? "";
    return Boolean(x && y && x === y);
}
