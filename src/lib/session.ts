import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "sensaura_session";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export { COOKIE_NAME };

export type SessionPayload = {
    userId: string;
    email: string;
    role: "ADMIN" | "USER";
    exp: number;
};

export function signSession(payload: Omit<SessionPayload, "exp">): string {
    const secret = process.env.SESSION_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error("SESSION_SECRET must be set and at least 32 characters");
    }
    const body = Buffer.from(
        JSON.stringify({
            ...payload,
            exp: Date.now() + MAX_AGE_MS,
        } satisfies SessionPayload),
        "utf8"
    ).toString("base64url");
    const sig = createHmac("sha256", secret).update(body).digest("base64url");
    return `${body}.${sig}`;
}

export function verifySession(token: string): SessionPayload | null {
    const secret = process.env.SESSION_SECRET;
    if (!secret) return null;
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [body, sig] = parts;
    const expected = createHmac("sha256", secret).update(body).digest("base64url");
    const a = Buffer.from(sig, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    try {
        const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
        if (payload.exp < Date.now()) return null;
        return payload;
    } catch {
        return null;
    }
}
