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

    const db = await getDb();
    const users = db.collection("users");
    const passwordHash = await bcrypt.hash(password, 10);
    const role = roleForEmail(email);

    try {
        const result = await users.insertOne({
            name,
            email,
            passwordHash,
            role,
            createdAt: new Date(),
        });

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
    } catch (e: unknown) {
        const code = (e as { code?: number })?.code;
        if (code === 11000) {
            return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
        }
        throw e;
    }
}
