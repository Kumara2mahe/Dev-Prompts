import { ToastContainer, Flip } from "react-toastify"

import { TOASTTIMER } from "@utils/constants"

const DialogBox = ({ children, classNames, id }) => {
    return (
        <dialog id={id} className={`popup_dialog ${classNames ? classNames : ""}`}>
            <div className="py-6 px-6">
                <div className="text-right">
                    <button type="button" className="close-btn" onClick={closeDialog} data-parent-id={id}>
                        <svg className="rounded-full group" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <path className="fill-gray-400 opacity-40 group-hover:opacity-60 group-active:fill-orange-500" d="M14.34 -0.000244141H5.67C2.28 -0.000244141 0 2.37976 0 5.91976V14.0898C0 17.6198 2.28 19.9998 5.67 19.9998H14.34C17.73 19.9998 20 17.6198 20 14.0898V5.91976C20 2.37976 17.73 -0.000244141 14.34 -0.000244141Z" />
                                <path className="fill-gray-800 group-active:fill-orange-950" d="M13.0156 11.7703L11.2366 9.99226L13.0146 8.21426C13.3566 7.87326 13.3566 7.31826 13.0146 6.97726C12.6726 6.63326 12.1196 6.63426 11.7776 6.97626L9.99858 8.75426L8.21958 6.97426C7.87758 6.63226 7.32358 6.63426 6.98158 6.97426C6.64058 7.31626 6.64058 7.87126 6.98158 8.21226L8.76158 9.99226L6.98558 11.7673C6.64358 12.1093 6.64358 12.6643 6.98558 13.0043C7.15658 13.1763 7.37958 13.2613 7.60358 13.2613C7.82858 13.2613 8.05158 13.1763 8.22258 13.0053L9.99858 11.2293L11.7786 13.0083C11.9496 13.1793 12.1726 13.2643 12.3966 13.2643C12.6206 13.2643 12.8446 13.1783 13.0156 13.0083C13.3576 12.6663 13.3576 12.1123 13.0156 11.7703Z" />
                            </g>
                        </svg>
                    </button>
                </div>
                {children}
                <ToastContainer stacked containerId={id} position="bottom-right" autoClose={TOASTTIMER} hideProgressBar={false}
                    newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss={false} draggable theme="light" transition={Flip} />
            </div>
        </dialog>
    )
}
export const getDialog = (element) => {
    if (element.dataset.parentId && element.dataset.parentId !== "") {
        return document.getElementById(element.dataset.parentId)
    }
    return null
}
export const openDialog = (event, formSubmit = null) => {
    const dialog = getDialog(event.target)
    if (!dialog) {
        return
    }
    if (formSubmit) {
        const form = dialog.querySelector("form")
        if (form) {
            form.onsubmit = formSubmit
        }
    }
    dialog.showModal()
    dialog.addEventListener("click", listenToCloseDialog)
}
export const listenToCloseDialog = (event) => {
    const dialog = event.currentTarget
    if (!dialog) {
        return
    }
    event.target === dialog && closeDialog(null, dialog)
}
export const closeDialog = (event, dialog = null) => {
    if (event) {
        dialog = getDialog(event.currentTarget)
    }
    if (!dialog) {
        return
    }
    dialog.close("")
    dialog.removeEventListener("click", listenToCloseDialog)
}
export default DialogBox