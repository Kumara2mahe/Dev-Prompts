import mongoose from "mongoose"


if (!process.env.DATABASE_URI) {
    throw new Error('Invalid/Missing environment variable: "DATABASE_URI"')
}

export const connectToDB = async () => {
    mongoose.set("strictQuery", true)
    if (mongoose.connection.readyState >= 1) {
        return
    }
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            dbName: process.env.DATABASE_NAME,
        })
        console.log("MongoDB Connected!")
    }
    catch (error) {
        console.log(error)
    }
}