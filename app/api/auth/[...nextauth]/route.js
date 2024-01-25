import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

import { connectToDB } from "@utils/database"
import User from "@models/user"

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
    ],
    callbacks: {
        async session({ session }) {
            const expiryTime = new Date(session.expires).getTime()
            const currentTime = new Date().getTime()
            if (expiryTime > currentTime) {
                await connectToDB()
                const sessionUser = await User.findOne({
                    email: session.user.email
                })
                session.user.id = sessionUser._id.toString()
            }
            return session
        },
        async signIn({ profile }) {
            try {
                await connectToDB()
                const user = await User.findOne({
                    email: profile.email
                })

                if (!user) {
                    await User.create({
                        email: profile.email,
                        name: profile.name.replace(/\s+/g, " ").trim(),
                        image: profile.picture
                    })
                }
                return true
            }
            catch (error) {
                return false
            }
        },
    }
})

export { handler as GET, handler as POST }