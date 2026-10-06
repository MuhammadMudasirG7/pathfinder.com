import mongoose from "mongoose";

const mongodbURL = process.env.MONGODB_URL;

if (!mongodbURL) {
    throw new Error("Please define MONGODB_URL in .env.local");
}

let cached = global.mongoose || {
    conn: null,
    promise: null
};

export async function connectDB() {

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(mongodbURL);
    }

    cached.conn = await cached.promise;

    global.mongoose = cached;

    return cached.conn;
}