import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"

import { connectToDB } from "@utils/database"
import User from "@models/user"

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
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
        async signIn({ account, profile }) {
            try {
                await connectToDB()
                const user = await User.findOne({
                    email: profile.email
                })
                let details = null
                if (account.provider === "google") {
                    details = {
                        email: profile.email,
                        name: profile.name.replace(/\s+/g, " ").trim(),
                        image: profile.picture
                    }
                }
                else if (account.provider === "github") {
                    details = {
                        email: profile.email,
                        name: profile.login.replace(/\s+/g, " ").trim(),
                        image: profile.avatar_url
                    }
                }
                if (details) {
                    !user && await User.create(details)
                    return true // authenticated
                }
                return "/?error=authinvalid"
            }
            catch (error) {
                return "/?error=authfailed"
            }
        },
    }
})

export { handler as GET, handler as POST }