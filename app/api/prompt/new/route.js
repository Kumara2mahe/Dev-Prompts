import { connectToDB } from "@utils/database"
import Prompt from "@models/prompt"

export const POST = async (req) => {
    const { userId, snippet, tag } = await req.json()

    try {
        await connectToDB()
        const prompt = new Prompt({
            creator: userId,
            snippet,
            tag
        })
        await prompt.save()
        return new Response(JSON.stringify(prompt), { status: 201 })
    }
    catch (error) {
        return new Response("Failed to create new prompt", { status: 500 })
    }
}