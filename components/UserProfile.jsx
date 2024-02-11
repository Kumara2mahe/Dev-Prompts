import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import ErrorPage from "next/error"

import { homePath } from "@utils/constants"
import Settings from "./Settings"
import PromptCardList from "./PromptCardList"

const UserProfile = ({ userid, desc, data, handleEdit, handleDelete }) => {
    const [notFound, showNotFound] = useState(null)
    const [name, setName] = useState("")
    const [privacy, setPrivacy] = useState(null)
    const [preference, setPreference] = useState(null)

    // Get user settings (privacy & preference)
    const requestsFetched = useRef(null)
    useEffect(() => {
        const fetchUserDetails = async () => {
            const response = await fetch(`/api/users/${userid}/settings`)
            if (response.ok) {
                const data = await response.json()
                if (data) {
                    setName(data.name)
                    data.privacy && setPrivacy(data.privacy)
                    data.preference && setPreference(data.preference)
                    return
                }
            }
            showNotFound(true)
        }
        if (userid && requestsFetched.current === null) {
            fetchUserDetails()
            requestsFetched.current = true
        }
    }, [userid])

    const router = useRouter()
    const handleTagClick = (tagName) => {
        const params = new URLSearchParams({ qTag: tagName }).toString()
        router.push(homePath + `?${params}`)
    }
    return (
        !notFound
            ? <section className="w-full">
                <div className="flex justify-start sm:justify-between items-start sm:items-center gap-4 flex-col sm:flex-row">
                    <div>
                        {name
                            ? <h1 className="head_text text-left">
                                <span className="bluey_violet_gradient">{name}</span>
                            </h1>
                            : <div className="animate-pulse flex mt-5 space-x-4">
                                <div className="w-1/2 space-y-6 py-1">
                                    <div className="h-12 bg-gradient-to-r from-slate-100 to-slate-200 rounded"></div>
                                </div>
                            </div>
                        }
                        {desc && <p className="desc text-left">{desc}</p>}
                    </div>
                    {handleEdit && handleDelete && <Settings privacy={privacy} preference={preference} />}
                </div>
                <PromptCardList
                    data={data}
                    handleTagClick={handleTagClick}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                />
            </section>
            : <ErrorPage statusCode={404} />
    )
}
export default UserProfile