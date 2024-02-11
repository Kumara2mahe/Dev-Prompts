import mongoose from "mongoose"


var isConnected = false

export const connectToDB = async () => {
    mongoose.set("strictQuery", true)

    if (isConnected) {
        console.log("MongoDB is already connected!")
        return
    }
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            dbName: process.env.DATABASE_NAME,
        })
        isConnected = true
        console.log("MongoDB Connected!")
    }
    catch (error) {
        console.log(error)
    }
}