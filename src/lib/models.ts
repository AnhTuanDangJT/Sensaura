export type User = {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "USER";
};

export type Artwork = {
    id: string;
    title: string;
    artist: string;
    status: "Approved" | "Pending" | "Rejected";
    hasMusic: boolean;
    image: string;
    userEmail: string;
    fileType?: "image" | "pdf";
    audioTracks?: { url: string; type: "link" | "upload" | "youtube" | "spotify" | "soundcloud" }[];
    desc?: string;
};
