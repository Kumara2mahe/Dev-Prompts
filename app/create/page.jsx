"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

import Form from "@components/Form"
import { TOASTTYPE_ERROR, TOASTTYPE_SUCCESS, profilePath } from "@utils/constants"
import toastify from "@utils/tostify"

const CreatePrompt = () => {
    const { data: session } = useSession()
    const router = useRouter()

    const [submitting, setSubmitting] = useState(false)
    const [prompt, setPrompt] = useState({ snippet: "", tags: [] })

    const createNewPrompt = async (e) => {
        e.preventDefault()
        const submitBtn = e.target.querySelector("button[type=submit]")
        submitBtn.disabled = true
        setSubmitting(true)

        try {
            const response = await fetch("/api/prompt/new", {
                method: "POST",
                body: JSON.stringify({
                    snippet: prompt.snippet,
                    userId: session.user.id,
                    tags: prompt.tags
                })
            })
            if (response.ok) {
                toastify("Prompt created!", TOASTTYPE_SUCCESS, submitBtn)
                router.push(profilePath)
            }
            else throw Error(await response.text())
        }
        catch (error) {
            toastify(error?.message, TOASTTYPE_ERROR, submitBtn)
        }
        finally {
            setSubmitting(false)
        }
    }
    return (
        <Form type="Create" prompt={prompt} setPrompt={setPrompt} submitting={submitting} handleSubmit={createNewPrompt} />
    )
}
export default CreatePrompt