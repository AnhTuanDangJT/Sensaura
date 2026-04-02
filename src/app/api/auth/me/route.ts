import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { roleForEmail } from "@/lib/adminConfig";
import { getSession, isConfigured } from "@/lib/authHelpers";

export async function GET() {
    if (!isConfigured()) {
        return NextResponse.json({ user: null, configured: false });
    }

    const session = await getSession();
    if (!session) {
        return NextResponse.json({ user: null, configured: true });
    }

    let userOid: ObjectId;
    try {
        userOid = new ObjectId(session.userId);
    } catch {
        return NextResponse.json({ user: null, configured: true });
    }

    try {
        const db = await getDb();
        const doc = await db.collection("users").findOne({ _id: userOid });

        if (!doc) {
            return NextResponse.json({ user: null, configured: true });
        }

        const rawEmail = doc.email;
        if (typeof rawEmail !== "string" || !rawEmail.trim()) {
            return NextResponse.json({ user: null, configured: true });
        }

        const email = rawEmail.toLowerCase().trim();
        const role = roleForEmail(email);

        return NextResponse.json({
            user: {
                id: (doc._id as ObjectId).toString(),
                name: doc.name as string,
                email,
                role,
            },
            configured: true,
        });
    } catch (e) {
        console.error("/api/auth/me:", e);
        return NextResponse.json(
            {
                user: null,
                configured: true,
                error: "Database unavailable.",
            },
            { status: 503 }
        );
    }
}
