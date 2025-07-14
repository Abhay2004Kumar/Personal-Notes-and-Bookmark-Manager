import mongoose, { ConnectOptions, Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) throw new Error("MONGODB_URI not defined");

interface CachedConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: CachedConnection;
}

// Initialize global mongoose if it doesn't exist
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

// Use the global mongoose instance
const { mongoose: cached } = global;

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: ConnectOptions = {
      dbName: "notes_bookmarks_app",
      bufferCommands: false,
    };
    
    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}
