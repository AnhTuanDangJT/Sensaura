import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getSession, isConfigured, isSessionAdmin } from "@/lib/authHelpers";
import { roleForEmail } from "@/lib/adminConfig";
import type { User } from "@/lib/models";

export async function GET() {
    if (!isConfigured()) {
        return NextResponse.json({ users: [], configured: false });
    }

    const session = await getSession();
    if (!session || !isSessionAdmin(session)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = await getDb();
    const docs = await db
        .collection("users")
        .find({}, { projection: { passwordHash: 0 } })
        .sort({ email: 1 })
        .toArray();

    const users: User[] = docs.map((d) => ({
        id: (d._id as ObjectId).toString(),
        name: d.name as string,
        email: (d.email as string).toLowerCase(),
        role: roleForEmail(d.email as string),
    }));

    return NextResponse.json({ users, configured: true });
}
