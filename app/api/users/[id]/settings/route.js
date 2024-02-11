import { connectToDB } from "@utils/database"
import User from "@models/user"
import Settings from "@models/settings"

export const GET = async (req, { params }) => {
    try {
        var userData
        await connectToDB()
        const settings = await Settings.findOne({ owner: params.id }).populate("owner")
        if (!settings) {
            const user = await User.findById(params.id)
            if (!user) {
                return new Response("User not found", { status: 404 })
            }
            userData = { name: user.name, email: user.email }
        }
        else {
            userData = {
                name: settings.owner.name,
                email: settings.owner.email,
                privacy: settings.privacy,
                preference: settings.preference
            }
            if (settings.privacy.hideEmail) {
                userData.email = null
            }
            if (settings.preference.customUsername && settings.preference.username !== "") {
                userData.name = settings.preference.username
            }
        }
        return new Response(JSON.stringify(userData), { status: 200 })
    }
    catch (error) {
        return new Response("Failed to fetch user settings.", { status: 500 })
    }
}

export const POST = async (req, { params }) => {
    const { userId, privacy, preference } = await req.json()
    try {
        if (preference.customUsername && (!preference.username || String(preference.username).length < 3)) {
            return new Response("Username should be at least 3 characters long.", { status: 400 })
        }
        const privacySetting = {
            hideEmail: privacy.hideEmail,
        }
        const preferenceSetting = {
            customUsername: preference.customUsername,
            username: preference.username !== "" ? preference.username : null
        }
        await connectToDB()
        const user = await Settings.findOne({ "preference.username": preference.username })
        if (user && user.owner.toString() !== userId) {
            return new Response("Username already exists, try another.", { status: 400 })
        }
        var settings = await Settings.findOne({ owner: params.id })
        if (!settings) {
            settings = new Settings({
                owner: userId,
                privacy: privacySetting,
                preference: preferenceSetting
            })
        }
        else {
            settings.privacy = privacySetting
            settings.preference = preferenceSetting
        }
        settings.save()
        return new Response("Settings updated!", { status: 200 })
    }
    catch (error) {
        return new Response("Failed to update settings", { status: 500 })
    }
}