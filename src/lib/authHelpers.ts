import { cookies } from "next/headers";
import { verifySession, COOKIE_NAME, type SessionPayload } from "./session";
import { roleForEmail } from "./adminConfig";

export type { SessionPayload };

/** Never trust session.role alone — derive admin from email (same rule as roleForEmail). */
export function isSessionAdmin(session: SessionPayload | null): boolean {
    if (!session?.email) return false;
    return roleForEmail(session.email) === "ADMIN";
}

export async function getSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySession(token);
}

export function isConfigured(): boolean {
    return Boolean(
        process.env.MONGODB_URI &&
            process.env.SESSION_SECRET &&
            process.env.SESSION_SECRET.length >= 32 &&
            process.env.NEXT_PUBLIC_SUPABASE_URL &&
            process.env.SUPABASE_SERVICE_ROLE_KEY
    );
}
