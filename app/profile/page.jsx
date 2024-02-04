"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import ErrorPage from "next/error"

import UserProfile from "@components/UserProfile"
import DialogBox, { closeDialog, getDialog } from "@components/DialogBox"
import {
    updatePromptPath,
    TOASTTYPE_ERROR, TOASTTYPE_SUCCESS
} from "@utils/constants"
import toastify from "@utils/tostify"

const Profile = () => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [prompts, setPrompts] = useState([])
    const [confirmation, setConfirmation] = useState("")

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
    const handleDelete = async (e, prompt) => {
        e.preventDefault()
        const submitBtn = e.target.querySelector("button[type=submit]")
        submitBtn.disabled = true
        try {
            const dialog = getDialog(e.target)
            const response = await fetch(`/api/prompt/${prompt._id}`, {
                method: "DELETE",
                body: JSON.stringify({
                    userId: session.user.id,
                    confirmation: dialog.querySelector('input[name="confirmdelete"]')?.value
                })
            })
            if (response.ok) {
                const remainingPrompts = prompts.filter(p => p._id !== prompt._id)
                setPrompts(remainingPrompts)
                if (dialog) {
                    closeDialog(null, dialog)
                    e.target.reset()
                    return toastify("Prompt deleted!", TOASTTYPE_SUCCESS, submitBtn)
                }
            }
            else throw Error(await response.text())
        }
        catch (error) {
            toastify(error?.message, TOASTTYPE_ERROR, submitBtn, deletePromptDialog)
        }
    }

    return status !== "loading" && (
        status === "authenticated" && session?.user.id
            ? <>
                <UserProfile
                    name={session?.user.name}
                    desc="Welcome! to the personalized profile page, from here you can view/manage your prompts."
                    data={prompts}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                />
                <DialogBox id={deletePromptDialog}>
                    <p className="desc mt-10 mb-35">To confirm, type "<span className="orange_gradient selection:bg-[#5ECFC3] selection:text-white">{confirmationPhrase}</span>" in the box below</p>
                    <form id="deleteprompt" method="dialog" className="flex-col" data-parent-id={deletePromptDialog}>
                        <input className="form_input form_delete_input" name="confirmdelete" type="text" required onChange={e => setConfirmation(e.target.value)} autoComplete="off" />
                        <div className="flex-between">
                            <button type="button" className="gray_outline_btn" onClick={closeDialog} data-parent-id={deletePromptDialog}>Cancel</button>
                            <button type="submit" className="red_outline_btn" disabled={confirmation !== confirmationPhrase}>Delete</button>
                        </div>
                    </form>
                </DialogBox>
            </>
            : <ErrorPage statusCode={401} title="Authentication required" />
    )
}
const deletePromptDialog = "deleteprompt-dialog"
const confirmationPhrase = "delete prompt"
export default Profile