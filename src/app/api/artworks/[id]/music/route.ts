import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { randomBytes } from "crypto";
import { getDb } from "@/lib/mongodb";
import { getSupabaseAdmin, getArtworksBucket } from "@/lib/supabaseAdmin";
import { getSession, isConfigured } from "@/lib/authHelpers";
import { docToArtwork, type ArtworkDoc } from "@/lib/artworkDoc";

export const maxDuration = 60;

type Ctx = { params: Promise<{ id: string }> };

function storageObjectPathFromPublicUrl(publicUrl: string, bucket: string): string | null {
    const marker = `/object/public/${bucket}/`;
    const i = publicUrl.indexOf(marker);
    if (i === -1) return null;
    return decodeURIComponent(publicUrl.slice(i + marker.length).split("?")[0] ?? "");
}

export async function POST(request: Request, ctx: Ctx) {
    if (!isConfigured()) {
        return NextResponse.json({ error: "Server not configured" }, { status: 503 });
    }

    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await ctx.params;
    let oid: ObjectId;
    try {
        oid = new ObjectId(id);
    } catch {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const db = await getDb();
    const coll = db.collection<ArtworkDoc>("artworks");
    const art = await coll.findOne({ _id: oid });
    if (!art) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const owner = art.userEmail.toLowerCase();
    const sessionEmail = session.email.toLowerCase();
    if (owner !== sessionEmail) {
        return NextResponse.json({ error: "Only the artwork owner can add music." }, { status: 403 });
    }

    const tracks = art.audioTracks ?? [];
    if (tracks.length >= 3) {
        return NextResponse.json({ error: "Maximum of 3 tracks reached." }, { status: 400 });
    }

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
        const form = await request.formData();
        const file = form.get("file");
        if (!file || !(file instanceof File)) {
            return NextResponse.json({ error: "Audio file is required." }, { status: 400 });
        }
        const MAX = 25 * 1024 * 1024;
        if (file.size > MAX) {
            return NextResponse.json({ error: "Audio must be 25MB or smaller." }, { status: 400 });
        }

        const ext = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8) || "audio";
        const path = `audio/${id}/${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        const supabase = getSupabaseAdmin();
        const bucket = getArtworksBucket();

        const { error: upErr } = await supabase.storage.from(bucket).upload(path, buffer, {
            contentType: file.type || "audio/mpeg",
            upsert: false,
        });
        if (upErr) {
            console.error(upErr);
            return NextResponse.json({ error: "Failed to upload audio." }, { status: 500 });
        }

        const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
        const url = pub.publicUrl;
        const newTracks = [...tracks, { url, type: "upload" }];

        await coll.updateOne(
            { _id: oid },
            { $set: { audioTracks: newTracks, hasMusic: true } }
        );
    } else {
        let body: { link?: string };
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
        }
        const link = body.link?.trim();
        if (!link) {
            return NextResponse.json({ error: "Link is required." }, { status: 400 });
        }

        const t = link.includes("spotify.com")
            ? "spotify"
            : link.includes("youtube.com") || link.includes("youtu.be")
              ? "youtube"
              : link.includes("soundcloud.com")
                ? "soundcloud"
                : "link";

        const newTracks = [...tracks, { url: link, type: t }];
        await coll.updateOne(
            { _id: oid },
            { $set: { audioTracks: newTracks, hasMusic: true } }
        );
    }

    const doc = await coll.findOne({ _id: oid });
    if (!doc) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ artwork: docToArtwork(doc as ArtworkDoc) });
}

export async function DELETE(request: Request, ctx: Ctx) {
    if (!isConfigured()) {
        return NextResponse.json({ error: "Server not configured" }, { status: 503 });
    }

    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await ctx.params;
    let oid: ObjectId;
    try {
        oid = new ObjectId(id);
    } catch {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const indexStr = new URL(request.url).searchParams.get("index");
    const index = indexStr !== null ? Number.parseInt(indexStr, 10) : NaN;
    if (!Number.isInteger(index) || index < 0) {
        return NextResponse.json({ error: "Query ?index= is required (non-negative integer)." }, { status: 400 });
    }

    const db = await getDb();
    const coll = db.collection<ArtworkDoc>("artworks");
    const art = await coll.findOne({ _id: oid });
    if (!art) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const owner = art.userEmail.toLowerCase();
    const sessionEmail = session.email.toLowerCase();
    if (owner !== sessionEmail) {
        return NextResponse.json({ error: "Only the artwork owner can remove music." }, { status: 403 });
    }

    const tracks = [...(art.audioTracks ?? [])];
    if (index >= tracks.length) {
        return NextResponse.json({ error: "Invalid track index." }, { status: 400 });
    }

    const [removed] = tracks.splice(index, 1);

    if (removed?.type === "upload" && removed.url) {
        const bucket = getArtworksBucket();
        const path = storageObjectPathFromPublicUrl(removed.url, bucket);
        if (path) {
            const { error: rmErr } = await getSupabaseAdmin().storage.from(bucket).remove([path]);
            if (rmErr) {
                console.error("Supabase remove upload failed:", rmErr);
            }
        }
    }

    const hasMusic = tracks.length > 0;
    await coll.updateOne({ _id: oid }, { $set: { audioTracks: tracks, hasMusic } });

    const doc = await coll.findOne({ _id: oid });
    if (!doc) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ artwork: docToArtwork(doc as ArtworkDoc) });
}
