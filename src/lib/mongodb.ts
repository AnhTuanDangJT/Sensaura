import { Db, MongoClient } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db> {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not set");

    if (!db) {
        client = new MongoClient(uri);
        await client.connect();
        db = client.db(process.env.MONGODB_DB_NAME || "sensaura");
        await db.collection("users").createIndex({ email: 1 }, { unique: true });
    }
    return db;
}
