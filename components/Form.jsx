import { useSession } from "next-auth/react"
import Link from "next/link"

import SubmitButtonLoader from "./formInputs/SubmitButtonLoader"
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

    const handleTagChange = (e) => {
        let tags = e.target.value.split(",")
        tags = tags.map(tag => tag.trimStart())
        setPrompt({ ...prompt, tags: tags })
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
                            className="form_input" placeholder="#tag" value={prompt.tags.join(", ")} required
                            onChange={handleTagChange}
                        />
                        <div className="flex items-center gap-1 flex-wrap mt-2">
                            {prompt.tags.map((tag, index) => (
                                tag &&
                                <button className="bg-teal-50 text-gray-800 font-inter text-sm py-0.5 px-2 border border-green-100 rounded-xl shadow-sm cursor-pointer" key={index}>
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </label>
                    <div className="flex-end mx-3 mb-5 gap-4">
                        <Link className="px-3 py-0.5 text-gray-500 text-sm" href={homePath}>Cancel</Link>
                        <button className="px-5 py-1.5 text-sm bg-primary-green rounded-full text-white disabled:bg-[#6DD3C8] disabled:hover:cursor-not-allowed" type="submit">
                            <SubmitButtonLoader submitting={submitting} submitBtnText={submitBtnText} />
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}
export default Form