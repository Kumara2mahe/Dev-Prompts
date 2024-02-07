import { useRouter } from "next/navigation"

import { homePath } from "@utils/constants"
import Settings from "./Settings"
import PromptCardList from "./PromptCardList"

const UserProfile = ({ name, desc, data, handleEdit, handleDelete }) => {
    const router = useRouter()

    const handleTagClick = (tagName) => {
        const params = new URLSearchParams({ qTag: tagName }).toString()
        router.push(homePath + `?${params}`)
    }
    let privacy, preference
    data.map(prompt => {
        if (prompt.creator.privacy) {
            privacy = prompt.creator.privacy
        }
        if (prompt.creator.preference) {
            preference = prompt.creator.preference
        }
    })
    return (
        <section className="w-full">
            <div className="flex justify-start sm:justify-between items-start sm:items-center gap-4 flex-col sm:flex-row">
                <div>
                    {name
                        ? <h1 className="head_text text-left">
                            <span className="bluey_violet_gradient">{name}</span>
                        </h1>
                        : <div className="animate-pulse flex mt-5 space-x-4">
                            <div class="w-1/2 space-y-6 py-1">
                                <div class="h-12 bg-gradient-to-r from-slate-100 to-slate-200 rounded"></div>
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
    )
}
export default UserProfile