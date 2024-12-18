import { connectToDB } from "@utils/database"
import User from "@models/user"
import Settings from "@models/settings"
import Prompt from "@models/prompt"

export const dynamic = "force-dynamic"
export const GET = async () => {
    try {
        await connectToDB()
        const settings = await Settings.find({})

        // Update 'tag' to 'tags'
        const _prompts = await Prompt.find({ $or: [{ tags: null }, { tags: { $size: 0 } }] })
        _prompts.map(async (prompt) => {
            if (prompt.tags && prompt.tags.length > 0) {
                return
            }
            prompt.tags = Array().concat(prompt.tag).concat(prompt.tags)
            await prompt.save()
        })

        const prompts = await Prompt.find({}).sort("-updatedAt").populate("creator")
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