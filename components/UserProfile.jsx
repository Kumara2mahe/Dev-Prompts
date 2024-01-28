import { useRouter } from "next/navigation"

import { homePath } from "@utils/constants"
import PromptCardList from "./PromptCardList"

const UserProfile = ({ name, desc, data, handleEdit, handleDelete }) => {
    const router = useRouter()
    const handleTagClick = (tagName) => {
        const params = new URLSearchParams({ qTag: tagName }).toString()
        router.push(homePath + `?${params}`)
    }
    return (
        <section className="w-full">
            <h1 className="head_text text-left">
                <span className="bluey_violet_gradient">{name}</span>
            </h1>
            {desc && <p className="desc text-left">{desc}</p>}
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