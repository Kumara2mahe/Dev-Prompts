import { connectToDB } from "@utils/database"
import Settings from "@models/settings"
import Prompt from "@models/prompt"

export const GET = async (req, { params }) => {
    try {
        await connectToDB()
        const settings = await Settings.findOne({ owner: params.id })
        const prompts = await Prompt.find({ creator: params.id }).sort("-updatedAt").populate("creator")
        const filteredPrompts = prompts.map((prompt) => {
            let _prompt = {
                id: prompt._id,
                snippet: prompt.snippet,
                tags: prompt.tags,
                creator: {
                    id: prompt.creator._id,
                    email: prompt.creator.email,
                    name: prompt.creator.name,
                    image: prompt.creator.image
                }
            }
            if (settings) {
                _prompt.creator.privacy = settings?.privacy
                _prompt.creator.preference = settings?.preference
                if (settings.privacy.hideEmail) {
                    _prompt.creator.email = prompt.creator.name.trim().toLowerCase().slice(0, 3) + "****@devprompts.in"
                }
            }
            return _prompt
        })
        return new Response(JSON.stringify(filteredPrompts), { status: 200 })
    }
    catch (error) {
        return new Response("Failed to fetch all prompts", { status: 500 })
    }
}