import { toast } from "react-toastify"

import {
    TOASTTYPE_ERROR, TOASTTYPE_INFO, TOASTTYPE_SUCCESS, TOASTTYPE_WARN,
    TOASTTIMER
} from "./constants"

const toastify = (message, status, submitButton, containerId = "app") => {
    switch (status) {
        case TOASTTYPE_ERROR:
            toast.error(message, { containerId })
            break
        case TOASTTYPE_INFO:
            toast.info(message, { containerId })
            break
        case TOASTTYPE_SUCCESS:
            toast.success(message, { containerId })
            break
        case TOASTTYPE_WARN:
            toast.warn(message, { containerId })
            break
        default:
            toast(message, { containerId })
            break
    }
    submitButton && setTimeout(() => {
        submitButton.disabled = false
    }, TOASTTIMER)
}
export default toastify