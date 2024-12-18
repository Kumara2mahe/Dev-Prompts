"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import ErrorPage from "next/error"

import Form from "@components/Form"
import { TOASTTYPE_ERROR, TOASTTYPE_SUCCESS, profilePath } from "@utils/constants"
import toastify from "@utils/tostify"

const UpdatePrompt = () => {
    const { data: session } = useSession()
    const router = useRouter()
    const { id: promptId } = useParams()

    const [fetched, setfetched] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [prompt, setPrompt] = useState({ snippet: "", tags: [] })

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/prompt/${promptId}`)
            if (response.ok) {
                const data = await response.json()
                setPrompt(data)
                setfetched(TOASTTYPE_SUCCESS)
            }
            else setfetched(TOASTTYPE_ERROR)
        })()
    }, [promptId])

    const UpdateOldPrompt = async (e) => {
        e.preventDefault()
        const submitBtn = e.target.querySelector("button[type=submit]")
        submitBtn.disabled = true
        setSubmitting(true)

        try {
            const response = await fetch(`/api/prompt/${promptId}`, {
                method: "PATCH",
                body: JSON.stringify({
                    snippet: prompt.snippet,
                    userId: session.user.id,
                    tags: prompt.tags
                })
            })
            if (response.ok) {
                toastify("Prompt updated!", TOASTTYPE_SUCCESS, submitBtn)
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
        fetched !== null && (
            fetched === TOASTTYPE_SUCCESS
                ? <Form type="Edit" prompt={prompt} setPrompt={setPrompt} submitting={submitting} handleSubmit={UpdateOldPrompt} submitBtnText="Save" />
                : <ErrorPage statusCode={404} />
        )
    )
}
export default UpdatePrompt