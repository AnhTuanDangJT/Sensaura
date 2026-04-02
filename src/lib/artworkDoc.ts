import type { ObjectId } from "mongodb";
import type { Artwork } from "./models";

export type ArtworkDoc = {
    _id: ObjectId;
    title: string;
    artist: string;
    userEmail: string;
    status: "Approved" | "Pending" | "Rejected";
    imageUrl: string;
    fileType?: "image" | "pdf";
    desc?: string;
    hasMusic?: boolean;
    audioTracks?: { url: string; type: string }[];
    createdAt?: Date;
};

export function docToArtwork(doc: ArtworkDoc): Artwork {
    return {
        id: doc._id.toString(),
        title: doc.title,
        artist: doc.artist,
        status: doc.status,
        hasMusic: doc.hasMusic ?? false,
        image: doc.imageUrl,
        userEmail: doc.userEmail,
        fileType: doc.fileType,
        desc: doc.desc,
        audioTracks: doc.audioTracks as Artwork["audioTracks"],
    };
}
