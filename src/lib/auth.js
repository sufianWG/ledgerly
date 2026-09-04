import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

// reuse the same MongoClient across Next.js dev hot-reloads instead of opening
// a fresh connection on every file edit (was causing "unable_to_create_user"
// intermittently when two connections raced on the same write)
let client;
if (process.env.NODE_ENV === "development") {
    if (!globalThis._mongoClient) {
        globalThis._mongoClient = new MongoClient(process.env.MONGODB_URI);
    }
    client = globalThis._mongoClient;
} else {
    client = new MongoClient(process.env.MONGODB_URI);
}

const db = client.db(process.env.MONGO_DB);

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        // Optional: if you don't provide a client, database transactions won't be enabled.
        client
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: false
    },
    baseURL: process.env.BETTER_AUTH_URL,
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "user",
                input: false
            },
            isPremium: {
                type: "boolean",
                defaultValue: false,
                input: false
            }
        }
    },
    plugins: [
        jwt()
    ]
});