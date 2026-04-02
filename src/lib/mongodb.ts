import { Db, MongoClient, type MongoClientOptions } from "mongodb";

/** Tuned for serverless (Vercel): small pool, explicit timeouts. */
const clientOptions: MongoClientOptions = {
    serverSelectionTimeoutMS: 10_000,
    connectTimeoutMS: 10_000,
    maxPoolSize: 10,
};

type MongoSlot = { clientPromise: Promise<MongoClient>; db: Db | null };

const globalForMongo = globalThis as typeof globalThis & {
    __sensaura_mongo?: MongoSlot;
};

function getSlot(): MongoSlot {
    const uri = process.env.MONGODB_URI?.trim();
    if (!uri) {
        throw new Error("MONGODB_URI is not set");
    }

    if (!globalForMongo.__sensaura_mongo) {
        const client = new MongoClient(uri, clientOptions);
        const clientPromise = client.connect().then(
            () => client,
            (err: unknown) => {
                delete globalForMongo.__sensaura_mongo;
                return Promise.reject(err);
            }
        );
        globalForMongo.__sensaura_mongo = { clientPromise, db: null };
    }
    return globalForMongo.__sensaura_mongo;
}

function connectionHint(err: unknown): string {
    const msg = err instanceof Error ? err.message : String(err);
    return [
        `MongoDB: ${msg}`,
        "Check: (1) Atlas → Network Access → allow 0.0.0.0/0 for Vercel/serverless IPs;",
        "(2) Database user/password in MONGODB_URI;",
        "(3) URL-encode special characters in the password;",
        "(4) Cluster is running and the URI matches (mongodb+srv).",
    ].join(" ");
}

export async function getDb(): Promise<Db> {
    try {
        const slot = getSlot();
        const client = await slot.clientPromise;

        if (!slot.db) {
            slot.db = client.db(process.env.MONGODB_DB_NAME || "sensaura");
            await slot.db.collection("users").createIndex({ email: 1 }, { unique: true });
        }
        return slot.db;
    } catch (err) {
        throw new Error(connectionHint(err));
    }
}
