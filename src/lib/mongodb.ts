import mongoose from "mongoose";
// const MONGODB_URI_1 = process.env.MONGODB_URI!;

const MONGODB_URI =
  "mongodb+srv://manmohan0709_db_user:UL376V1aMSdSWo9Q@cluster0.bfv0udb.mongodb.net/?appName=Cluster0";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

async function connectDB() {
  try {
    // already connected
    if (cached.conn) {
      console.log("✅ MongoDB already connected");
      return cached.conn;
    }

    // create new connection
    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URI, {
        dbName: "productdb",
      });
    }

    cached.conn = await cached.promise;

    console.log("✅ MongoDB Connected Successfully");

    return cached.conn;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }
}

export default connectDB;
