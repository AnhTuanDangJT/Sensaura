import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
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

    let body: { email?: string; password?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const db = await getDb();
    const users = db.collection("users");
    const user = await users.findOne({ email });

    if (!user || typeof user.passwordHash !== "string") {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const role = roleForEmail(email);
    await users.updateOne({ _id: user._id as ObjectId }, { $set: { role } });

    const token = signSession({
        userId: (user._id as ObjectId).toString(),
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
        user: {
            id: (user._id as ObjectId).toString(),
            name: user.name as string,
            email,
            role,
        },
    });
}
