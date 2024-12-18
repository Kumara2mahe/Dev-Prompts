import { connectToDB } from "@utils/database"
import Prompt from "@models/prompt"

export const GET = async (req, { params }) => {
    try {
        await connectToDB()
        const prompt = await Prompt.findById(params.id)
        if (!prompt) {
            return new Response("Prompt not found", { status: 404 })
        }
        return new Response(
            JSON.stringify({
                snippet: prompt.snippet,
                tags: prompt.tags
            }),
            { status: 200 }
        )
    }
    catch (error) {
        return new Response("Failed to fetch prompt", { status: 500 })
    }
}

export const PATCH = async (req, { params }) => {
    const { userId, snippet, tags } = await req.json()
    try {
        await connectToDB()
        const prompt = await Prompt.findById(params.id)
        if (!prompt) {
            return new Response("Prompt not found", { status: 404 })
        }
        else if (prompt.creator._id.toString() !== userId) {
            return new Response("Failed to update prompt, only creator can perform such operation.", { status: 400 })
        }

        // Sanitize values
        const sSnippet = snippet.trim()
        const sTags = tags.filter(tag => tag !== "")

        // Update prompt
        prompt.snippet = sSnippet
        prompt.tags = sTags
        await prompt.save()
        return new Response(JSON.stringify(prompt), { status: 200 })
    }
    catch (error) {
        return new Response("Failed to update prompt", { status: 500 })
    }
}

export const DELETE = async (req, { params }) => {
    const { userId, confirmation } = await req.json()
    try {
        await connectToDB()
        const prompt = await Prompt.findById(params.id)
        if (!prompt) {
            return new Response("Prompt not found", { status: 404 })
        }
        else if (prompt.creator._id.toString() !== userId) {
            return new Response("Failed to delete prompt, only creator can perform such operation.", { status: 400 })
        }
        else if (confirmation !== "delete prompt") {
            return new Response("Entered phrase should match with the displayed phrase!", { status: 400 })
        }
        await Prompt.findByIdAndDelete(prompt._id)
        return new Response("Prompt deleted!", { status: 200 })
    }
    catch (error) {
        return new Response("Failed to delete prompt", { status: 500 })
    }
}