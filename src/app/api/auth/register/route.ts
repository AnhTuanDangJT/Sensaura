import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import { roleForEmail } from "@/lib/adminConfig";
import { signSession, COOKIE_NAME } from "@/lib/session";
import { isConfigured } from "@/lib/authHelpers";

export async function POST(request: Request) {
    if (!isConfigured()) {
        return NextResponse.json(
            { error: "Server is not configured. See .env.example for required variables." },
            { status: 503 }
        );
    }

    let body: { name?: string; email?: string; password?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!name || !email || !password) {
        return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
    }
    if (password.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    try {
        const db = await getDb();
        const users = db.collection("users");
        const passwordHash = await bcrypt.hash(password, 10);
        const role = roleForEmail(email);

        let result;
        try {
            result = await users.insertOne({
                name,
                email,
                passwordHash,
                role,
                createdAt: new Date(),
            });
        } catch (e: unknown) {
            const code = (e as { code?: number })?.code;
            if (code === 11000) {
                return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
            }
            throw e;
        }

        try {
            const token = signSession({
                userId: result.insertedId.toString(),
                email,
                role,
            });

            const cookieStore = await cookies();
            cookieStore.set(COOKIE_NAME, token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
            });

            return NextResponse.json({
                user: { id: result.insertedId.toString(), name, email, role },
            });
        } catch (e) {
            try {
                await db.collection("users").deleteOne({ _id: result.insertedId });
            } catch {
                /* ignore cleanup failure */
            }
            console.error("Session/cookie step failed after user insert:", e);
            return NextResponse.json(
                {
                    error:
                        "Could not finish sign-in after creating your account. Ensure SESSION_SECRET is set and at least 32 characters on the server.",
                },
                { status: 500 }
            );
        }
    } catch (e) {
        console.error("Registration failed:", e);
        return NextResponse.json(
            {
                error:
                    "Could not reach the database. On Vercel, allow MongoDB Atlas access from anywhere (Network Access → 0.0.0.0/0) or add Vercel IPs, and verify MONGODB_URI.",
            },
            { status: 503 }
        );
    }
}
