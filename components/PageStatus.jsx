"use client"

import { useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"

import { TOASTTYPE_ERROR } from "@utils/constants"
import toastify from "@utils/tostify"

const PageStatus = () => {
    const errormessage = useRef()
    const searchParams = useSearchParams()
    const error = searchParams.get(TOASTTYPE_ERROR)
    useEffect(() => {
        if (!errormessage.current) {
            let message = ""
            switch (error) {
                case "authfailed":
                    errormessage.current = true
                    message = "Authentication failed, try again."
                    break
                case "authinvalid":
                    errormessage.current = true
                    message = "Unexpected error occured, try later."
                    break
                default:
                    message = null
                    break
            }
            message && toastify(message, TOASTTYPE_ERROR)
        }
    }, [error])

    return null
}
export default PageStatus