"use client"

import { useState } from "react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { profilePath } from "@utils/constants"

const PromptCard = ({ prompt, handleTagClick, handleEdit, handleDelete }) => {
    const { data: session } = useSession()
    const pathName = usePathname()
    const router = useRouter()

    const [copied, setCopied] = useState("")
    const handleCopy = () => {
        setCopied(prompt.snippet)
        navigator.clipboard.writeText(prompt.snippet)
        setTimeout(() => {
            setCopied("")
        }, 3000)
    }
    const handleProfileClick = () => {
        if (prompt.creator._id === session?.user.id) {
            return router.push(profilePath)
        }
        router.push(`/profile/${prompt.creator._id}`)
    }
    return (
        <div className="prompt_card glassmorphism">
            <div className="flex justify-between items-start gap-5">
                <div className="flex-1 flex flex-wrap sm:flex-nowrap justify-start items-center gap-3 cursor-pointer max-w-60" onClick={handleProfileClick}>
                    <Image
                        className="rounded-full object-contain"
                        src={prompt.creator.image}
                        alt="userimage"
                        width={40}
                        height={40}
                    />
                    <div className="flex flex-col overflow-hidden">
                        <h3 className="font-satoshi font-semibold text-gray-900 text-wrap">{prompt.creator.name}</h3>
                        {session?.user.id
                            ? <h3 className="font-inter text-sm text-gray-500 text-ellipsis overflow-hidden" title={prompt.creator.email}>{prompt.creator.email}</h3>
                            : <h3 className="font-inter text-sm text-gray-500 text-ellipsis overflow-hidden" title="Only visible to authenticated users!">{prompt.creator.email.slice(0, 3) + "*****@devprompts.in"}</h3>
                        }
                    </div>
                </div>
                <button className="copy_btn" onClick={handleCopy}>
                    <Image
                        src={copied === prompt.snippet ? "/assets/icons/tick.svg" : "/assets/icons/copy.svg"}
                        alt="copy-paste"
                        width={12}
                        height={12}
                    />
                </button>
            </div>
            <p className="my-4 p-4 font-satoshi text-sm text-gray-700 bg-white/80 rounded-lg select-text selection:bg-[#5ECFC3] selection:text-white">{prompt.snippet}</p>
            <button className="font-inter text-sm blue-gradient cursor-pointer" onClick={() => handleTagClick && handleTagClick(prompt.tag)}>#{prompt.tag}</button>
            {session?.user.id === prompt.creator._id && pathName === "/profile"
                && (
                    <div className="mt-5 flex-between gap-4 border-t border-gray-100 pt-3">
                        <button className="font-inter text-sm greeny_blue_gradient cursor-pointer" onClick={handleEdit}>Edit</button>
                        <button className="font-inter text-sm orange_gradient cursor-pointer" onClick={handleDelete}>Delete</button>
                    </div>
                )
            }
        </div>
    )
}
export default PromptCard