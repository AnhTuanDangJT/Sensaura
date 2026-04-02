import type { User } from "./models";

/** Must match server `ADMIN_EMAIL` default in `adminConfig.ts` */
const DEFAULT_ADMIN_EMAIL = "dganhtuan.2k5@gmail.com";

function allowlistedAdminEmail(): string {
    const raw = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const s = (typeof raw === "string" && raw.trim() ? raw : DEFAULT_ADMIN_EMAIL).toLowerCase().trim();
    return s;
}

/** True only if this address is the configured admin (public allowlist). */
export function isAdminEmail(email: string | null | undefined): boolean {
    const allowed = allowlistedAdminEmail();
    if (!allowed) return false;
    const e = email?.trim();
    if (!e) return false;
    return e.toLowerCase() === allowed;
}

/**
 * Show Admin nav / admin routes only when the API says ADMIN **and** the email matches the allowlist.
 * Prevents a bad or stale `role` field from exposing admin UI to every account.
 */
export function canSeeAdminPanel(user: User | null | undefined): boolean {
    if (!user) return false;
    const role = typeof user.role === "string" ? user.role.toUpperCase() : "";
    if (role !== "ADMIN") return false;
    return isAdminEmail(user.email);
}
