import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getSession, isConfigured, isSessionAdmin } from "@/lib/authHelpers";
import { docToArtwork, type ArtworkDoc } from "@/lib/artworkDoc";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
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
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    let body: { action?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const action = body.action;
    if (action !== "approve" && action !== "reject") {
        return NextResponse.json({ error: "action must be approve or reject" }, { status: 400 });
    }

    const status = action === "approve" ? "Approved" : "Rejected";
    const db = await getDb();
    const coll = db.collection<ArtworkDoc>("artworks");
    const updated = await coll.updateOne({ _id: oid }, { $set: { status } });
    if (updated.matchedCount === 0) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const doc = await coll.findOne({ _id: oid });
    if (!doc) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ artwork: docToArtwork(doc as ArtworkDoc) });
}

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
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const db = await getDb();
    const del = await db.collection("artworks").deleteOne({ _id: oid });
    if (del.deletedCount === 0) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
}
