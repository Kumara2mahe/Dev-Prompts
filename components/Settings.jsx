"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

import DialogBox, { closeDialog, getDialog } from "./DialogBox"
import SubmitButtonLoader from "./formInputs/SubmitButtonLoader"
import toastify from "@utils/tostify"
import { TOASTTYPE_ERROR, TOASTTYPE_SUCCESS } from "@utils/constants"

const Settings = ({ privacy, preference }) => {
    const { data: session, update } = useSession()
    const [emailPrivacy, setEmailPrivacy] = useState(false)
    const [showUsername, setShowUsername] = useState(false)
    const [username, setUsername] = useState("")
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        privacy?.hideEmail && setEmailPrivacy(true)
        preference?.customUsername && setShowUsername(true)
        preference?.username && setUsername(preference.username)
    }, [privacy, preference])

    // Reset settings dialog on open/close
    const openDialogAndListen = (e) => {
        const dialog = getDialog(e.target)
        if (!dialog) {
            return
        }
        dialog.showModal()
        dialog.addEventListener("click", dialogCloseListener)
    }
    const dialogCloseListener = (e) => {
        const dialog = e.currentTarget
        if (!dialog) {
            return
        }
        if (e.target === dialog) {
            resetForm()
            closeDialog(null, dialog)
        }
    }
    const resetForm = () => {
        setEmailPrivacy(privacy?.hideEmail === true)
        setShowUsername(preference?.customUsername === true)
        setUsername(preference && preference.customUsername && preference.username !== "" ? preference.username : "")
    }
    const resetFormAndClose = (e) => {
        resetForm()
        closeDialog(e)
    }

    // Save user prefered settings
    const saveSettings = async (e) => {
        e.preventDefault()
        const submitBtn = e.target.querySelector("button[type=submit]")
        submitBtn.disabled = true
        setSubmitting(true)

        try {
            const response = await fetch(`/api/users/${session.user.id}/settings`, {
                method: "POST",
                body: JSON.stringify({
                    userId: session.user.id,
                    privacy: {
                        hideEmail: emailPrivacy
                    },
                    preference: {
                        customUsername: showUsername,
                        username: username !== "" ? username : null
                    }
                })
            })
            if (response.ok) {
                const dialog = getDialog(e.target)
                if (dialog) {
                    closeDialog(null, dialog)
                    update()
                    toastify("Settings updated!", TOASTTYPE_SUCCESS, submitBtn)
                }
            }
            else throw Error(await response.text())
        }
        catch (error) {
            toastify(error?.message, TOASTTYPE_ERROR, submitBtn, settingsDialog)
        }
        finally {
            setSubmitting(false)
        }
    }
    return session?.user.id && (<>
        <button title="settings" onClick={openDialogAndListen} data-parent-id={settingsDialog}>
            <svg className="active:rotate-90 group" width="24" height="24" data-parent-id={settingsDialog} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className="fill-gray-800 group-hover:fill-gray-950" data-parent-id={settingsDialog} d="M10.012 12.8299C8.40751 12.8299 7.10962 11.5799 7.10962 10.0099C7.10962 8.43993 8.40751 7.17993 10.012 7.17993C11.6165 7.17993 12.8837 8.43993 12.8837 10.0099C12.8837 11.5799 11.6165 12.8299 10.012 12.8299Z" />
                <path className="fill-gray-800 group-hover:fill-purple-800 opacity-30" data-parent-id={settingsDialog} d="M19.2301 12.37C19.036 12.07 18.76 11.77 18.4023 11.58C18.1162 11.44 17.9322 11.21 17.7687 10.94C17.2475 10.08 17.5541 8.95 18.4228 8.44C19.4447 7.87 19.7718 6.6 19.179 5.61L18.4943 4.43C17.9118 3.44 16.6344 3.09 15.6226 3.67C14.7233 4.15 13.5685 3.83 13.0473 2.98C12.8838 2.7 12.7918 2.4 12.8122 2.1C12.8429 1.71 12.7203 1.34 12.5363 1.04C12.1582 0.42 11.4735 0 10.7172 0H9.27627C8.53024 0.02 7.84553 0.42 7.4674 1.04C7.27323 1.34 7.16081 1.71 7.18125 2.1C7.20169 2.4 7.10972 2.7 6.9462 2.98C6.425 3.83 5.27019 4.15 4.38109 3.67C3.35913 3.09 2.09191 3.44 1.49917 4.43L0.814459 5.61C0.231943 6.6 0.55897 7.87 1.57071 8.44C2.43937 8.95 2.74596 10.08 2.23498 10.94C2.06125 11.21 1.87729 11.44 1.59115 11.58C1.24368 11.77 0.937094 12.07 0.773581 12.37C0.395456 12.99 0.415896 13.77 0.79402 14.42L1.49917 15.62C1.87729 16.26 2.58245 16.66 3.31825 16.66C3.66572 16.66 4.0745 16.56 4.40153 16.36C4.65702 16.19 4.96361 16.13 5.30085 16.13C6.31259 16.13 7.16081 16.96 7.18125 17.95C7.18125 19.1 8.12145 20 9.30692 20H10.6968C11.872 20 12.8122 19.1 12.8122 17.95C12.8429 16.96 13.6911 16.13 14.7029 16.13C15.0299 16.13 15.3365 16.19 15.6022 16.36C15.9292 16.56 16.3278 16.66 16.6855 16.66C17.411 16.66 18.1162 16.26 18.4943 15.62L19.2097 14.42C19.5776 13.75 19.6083 12.99 19.2301 12.37Z" />
            </svg>
        </button>
        <DialogBox id={settingsDialog} customCloseEvent={resetFormAndClose}>
            <h2 className="font-semibold text-xl sm:text-2xl max-w-2xl text-gray-700 mb-5">Settings</h2>
            <form id="settings" method="dialog" className="flex flex-col select-none" onSubmit={saveSettings} data-parent-id={settingsDialog}>
                <p className="desc">Privacy</p>
                <label className="m-2 group flex items-center gap-2">
                    <input name="emailprivacy" type="checkbox" className="peer/checkbox hidden" checked={emailPrivacy} onChange={e => setEmailPrivacy(e.target.checked)} />
                    <span className="form_custom_checkbox" />
                    <span className="">Don't show my email to anyone</span>
                </label>
                <p className="desc">Preferences</p>
                <label className="m-2 group flex items-center gap-2">
                    <input type="checkbox" className="peer/checkbox hidden" checked={showUsername} onChange={e => setShowUsername(e.target.checked)} />
                    <span className="form_custom_checkbox" />
                    <span className="">Use custom username</span>
                </label>
                {showUsername && <label className="mx-2">
                    <input className="form_input font-semibold text-gray-600 border-gray-200 border focus:border-purple-300" name="customusername" type="text" value={username} onChange={e => setUsername(e.target.value)} required autoComplete="off" />
                </label>}
                <div className="flex-between mt-8">
                    <button type="button" className="gray_outline_btn" onClick={resetFormAndClose} data-parent-id={settingsDialog}>Cancel</button>
                    <button type="submit" className="green_outline_btn">
                        <SubmitButtonLoader submitting={submitting} submitBtnText="Save" />
                    </button>
                </div>
            </form>
        </DialogBox>
    </>)
}
const settingsDialog = "settings-dialog"
export default Settings