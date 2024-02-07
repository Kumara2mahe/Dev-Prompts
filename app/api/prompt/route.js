import { connectToDB } from "@utils/database"
import User from "@models/user"
import Settings from "@models/settings"
import Prompt from "@models/prompt"

export const dynamic = "force-dynamic"
export const GET = async () => {
    try {
        await connectToDB()
        const settings = await Settings.find({})
        const prompts = await Prompt.find({}).sort("-updatedAt").populate("creator")
        const filteredPrompts = prompts.map((prompt) => {
            let _prompt = {
                id: prompt._id,
                snippet: prompt.snippet,
                tag: prompt.tag,
                creator: {
                    id: prompt.creator._id,
                    email: prompt.creator.email,
                    name: prompt.creator.name,
                    image: prompt.creator.image
                }
            }
            let [_setting] = settings.filter(s => s.owner.toString() === prompt.creator._id.toString())
            if (_setting) {
                _prompt.creator.privacy = _setting?.privacy
                _prompt.creator.preference = _setting?.preference
                if (_setting.privacy.hideEmail) {
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