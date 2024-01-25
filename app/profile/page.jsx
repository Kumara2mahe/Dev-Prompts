"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import ErrorPage from "next/error"

import UserProfile from "@components/UserProfile"
import {
    updatePromptPath,
    TOASTTYPE_ERROR, TOASTTYPE_SUCCESS
} from "@utils/constants"
import toastify from "@utils/tostify"

const Profile = () => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [prompts, setPrompts] = useState([])

    useEffect(() => {
        const fetchPrompts = async () => {
            const response = await fetch(`/api/users/${session.user.id}/posts`)
            if (response.ok) {
                const data = await response.json()
                if (data.length > 0) {
                    return setPrompts(data)
                }
            }
            setPrompts(null)
        }
        session?.user.id && fetchPrompts()
    }, [session])

    const handleEdit = (prompt) => {
        router.push(updatePromptPath.replace("%s", prompt._id))
    }
    const handleDelete = async (prompt) => {
        const confirmation = confirm("Are you sure to delete the prompt?")
        if (confirmation) {
            try {
                const response = await fetch(`/api/prompt/${prompt._id}`, {
                    method: "DELETE",
                    body: JSON.stringify({
                        snippet: prompt.snippet,
                        userId: session.user.id,
                        tag: prompt.tag
                    })
                })
                if (response.ok) {
                    const remainingPrompts = prompts.filter(p => p._id !== prompt._id)
                    setPrompts(remainingPrompts)
                    toastify("Prompt deleted!", TOASTTYPE_SUCCESS)
                }
                else throw Error(await response.text())
            }
            catch (error) {
                toastify(error?.message, TOASTTYPE_ERROR)
            }
        }
    }
    return status !== "loading" && (
        status === "authenticated" && session?.user.id
            ? <UserProfile
                name={session?.user.name}
                desc="Welcome! to the personalized profile page, from here you can view/manage your prompts."
                data={prompts}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
            : <ErrorPage statusCode={401} title="Authentication required" />
    )
}
export default Profile