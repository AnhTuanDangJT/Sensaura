import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { randomBytes } from "crypto";
import { getDb } from "@/lib/mongodb";
import { getSupabaseAdmin, getArtworksBucket } from "@/lib/supabaseAdmin";
import { getSession, isConfigured, isSessionAdmin } from "@/lib/authHelpers";
import { docToArtwork, type ArtworkDoc } from "@/lib/artworkDoc";

export const maxDuration = 60;

export async function GET() {
    if (!isConfigured()) {
        return NextResponse.json({ artworks: [], configured: false });
    }

    const db = await getDb();
    const coll = db.collection<ArtworkDoc>("artworks");
    const session = await getSession();

    if (!session) {
        const docs = await coll.find({ status: "Approved" }).sort({ createdAt: -1 }).toArray();
        return NextResponse.json({
            artworks: docs.map((d) => docToArtwork(d as ArtworkDoc)),
            configured: true,
        });
    }

    if (isSessionAdmin(session)) {
        const docs = await coll.find({}).sort({ createdAt: -1 }).toArray();
        return NextResponse.json({
            artworks: docs.map((d) => docToArtwork(d as ArtworkDoc)),
            configured: true,
        });
    }

    const email = session.email.toLowerCase();
    const docs = await coll
        .find({
            $or: [{ userEmail: email }, { status: "Approved" }],
        })
        .sort({ createdAt: -1 })
        .toArray();

    const seen = new Set<string>();
    const merged: ArtworkDoc[] = [];
    for (const d of docs) {
        const id = (d as ArtworkDoc)._id.toString();
        if (!seen.has(id)) {
            seen.add(id);
            merged.push(d as ArtworkDoc);
        }
    }

    return NextResponse.json({
        artworks: merged.map((d) => docToArtwork(d)),
        configured: true,
    });
}

export async function POST(request: Request) {
    if (!isConfigured()) {
        return NextResponse.json(
            { error: "Server is not configured. See .env.example for required variables." },
            { status: 503 }
        );
    }

    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await request.formData();
    const file = form.get("file");
    const title = (form.get("title") as string)?.trim();
    const desc = (form.get("description") as string)?.trim() ?? "";

    if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: "File is required." }, { status: 400 });
    }
    if (!title) {
        return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }

    const MAX = 20 * 1024 * 1024;
    if (file.size > MAX) {
        return NextResponse.json({ error: "File must be 20MB or smaller." }, { status: 400 });
    }

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isImage = file.type.startsWith("image/");
    if (!isPdf && !isImage) {
        return NextResponse.json({ error: "Only images or PDF files are allowed." }, { status: 400 });
    }

    const db = await getDb();
    const userDoc = await db.collection("users").findOne({ _id: new ObjectId(session.userId) });
    const artistName = (userDoc?.name as string) || session.email.split("@")[0];
    const userEmail = (userDoc?.email as string)?.toLowerCase() || session.email.toLowerCase();

    const ext =
        file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8) ||
        (isPdf ? "pdf" : "jpg");
    const path = `${session.userId}/${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const supabase = getSupabaseAdmin();
    const bucket = getArtworksBucket();

    const { error: upErr } = await supabase.storage.from(bucket).upload(path, buffer, {
        contentType: file.type || (isPdf ? "application/pdf" : "application/octet-stream"),
        upsert: false,
    });

    if (upErr) {
        console.error(upErr);
        return NextResponse.json(
            { error: "Failed to upload file to storage. Check Supabase bucket and policies." },
            { status: 500 }
        );
    }

    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
    const imageUrl = pub.publicUrl;

    const insert = await db.collection("artworks").insertOne({
        title,
        artist: artistName,
        userEmail,
        status: "Pending",
        imageUrl,
        fileType: isPdf ? "pdf" : "image",
        desc,
        hasMusic: false,
        audioTracks: [] as { url: string; type: string }[],
        createdAt: new Date(),
    });

    const doc = (await db.collection("artworks").findOne({
        _id: insert.insertedId,
    })) as ArtworkDoc | null;
    if (!doc) {
        return NextResponse.json({ error: "Failed to save artwork." }, { status: 500 });
    }

    return NextResponse.json({ artwork: docToArtwork(doc) });
}
