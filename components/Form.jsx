import { useSession } from "next-auth/react"
import Link from "next/link"

import { TOASTTYPE_WARN, homePath } from "@utils/constants"
import toastify from "@utils/tostify"

const Form = ({ type, prompt, setPrompt, submitting, handleSubmit, submitBtnText = type }) => {
    const { status } = useSession()

    const authRequired = (e) => {
        e.preventDefault()
        const submitBtn = e.target.querySelector("button[type=submit]")
        submitBtn.disabled = true
        toastify("Authentication required! SignIn and Continue", TOASTTYPE_WARN, submitBtn)
    }
    return (
        <section className="w-full max-w-full flex-start flex-col">
            <h1 className="head_text text-left"><span className="bluey_violet_gradient">{type} Prompt</span></h1>
            <p className="desc text-left max-w-md">{type} and share amazing prompts with the world, and let your imagination run wild with AI-powered platform.</p>
            <div className="mt-14 gradient_glass">
                <form className="w-full max-w-2xl flex flex-col gap-7 glassmorphism" onSubmit={status === "authenticated" ? handleSubmit : authRequired}>
                    <label>
                        <span className="font-satoshi font-semibold text-base text-gray-700">Your AI Prompt</span>
                        <textarea
                            className="form_textarea" placeholder="Write your prompt here.." value={prompt.snippet} required
                            onChange={e => setPrompt({ ...prompt, snippet: e.target.value })}
                        />
                    </label>
                    <label>
                        <span className="font-satoshi font-semibold text-base text-gray-700">Tag <span className="font-normal">(#code, #webdevelopment, #design)</span></span>
                        <input
                            className="form_input" placeholder="#tag" value={prompt.tag} required
                            onChange={e => setPrompt({ ...prompt, tag: e.target.value })}
                        />
                    </label>
                    <div className="flex-end mx-3 mb-5 gap-4">
                        <Link className="px-3 py-0.5 text-gray-500 text-sm" href={homePath}>Cancel</Link>
                        <button className="px-5 py-1.5 text-sm bg-primary-green rounded-full text-white disabled:bg-[#6DD3C8] disabled:hover:cursor-not-allowed" type="submit">
                            {!submitting
                                ? submitBtnText
                                : <span className="flex-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {submitBtnText.endsWith("e") ? submitBtnText.slice(0, -1) : submitBtnText}ing..
                                </span>
                            }
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}
export default Form