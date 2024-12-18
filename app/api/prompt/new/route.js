import { connectToDB } from "@utils/database"
import Prompt from "@models/prompt"

export const POST = async (req) => {
    const { userId, snippet, tags } = await req.json()

    try {
        // Sanitize values
        const sUserId = userId.trim()
        const sSnippet = snippet.trim()
        const sTags = tags.filter(tag => tag !== "")

        // Create prompt
        await connectToDB()
        const prompt = new Prompt({
            creator: sUserId,
            snippet: sSnippet,
            tags: sTags
        })
        await prompt.save()
        return new Response(JSON.stringify(prompt), { status: 201 })
    }
    catch (error) {
        return new Response("Failed to create new prompt", { status: 500 })
    }
}