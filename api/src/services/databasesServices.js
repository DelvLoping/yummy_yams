import mongoose from "mongoose";

export async function connectToDatabase() {
    try {
        await mongoose.connect("mongodb://docker_mongo:27017/ny", {
            authSource: "admin",
            user: "root",
            pass: "foobar"
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}