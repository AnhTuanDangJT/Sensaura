import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getSession, isConfigured, isSessionAdmin } from "@/lib/authHelpers";
import { getAdminEmail } from "@/lib/adminConfig";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, ctx: Ctx) {
    if (!isConfigured()) {
        return NextResponse.json({ error: "Server not configured" }, { status: 503 });
    }

    const session = await getSession();
    if (!session || !isSessionAdmin(session)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await ctx.params;
    let oid: ObjectId;
    try {
        oid = new ObjectId(id);
    } catch {
        return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    if (session.userId === id) {
        return NextResponse.json({ error: "You cannot delete your own account." }, { status: 403 });
    }

    const db = await getDb();
    const users = db.collection("users");
    const user = await users.findOne({ _id: oid });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const email = String(user.email ?? "")
        .toLowerCase()
        .trim();
    if (!email) {
        return NextResponse.json({ error: "Invalid user record" }, { status: 400 });
    }

    if (email === getAdminEmail()) {
        return NextResponse.json({ error: "Cannot delete the administrator account." }, { status: 403 });
    }

    const emailRegex = new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
    await db.collection("artworks").deleteMany({ userEmail: emailRegex });
    const del = await users.deleteOne({ _id: oid });
    if (del.deletedCount === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
}
