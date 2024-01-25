import Image from "next/image"

import PromptCard from "./PromptCard"

const PromptCardList = ({ data, handleTagClick, handleEdit, handleDelete }) => {
    return (
        data
            ? <div className="mt-16 prompt_layout gradient_prompt_card">
                {data.map(prompt => (
                    <PromptCard
                        key={prompt._id}
                        prompt={prompt}
                        handleTagClick={() => handleTagClick && handleTagClick(prompt.tag)}
                        handleEdit={() => handleEdit && handleEdit(prompt)}
                        handleDelete={() => handleDelete && handleDelete(prompt)}
                    />
                ))
                }
            </div>
            : <div className="my-16 pt-2 pb-4 flex-center flex-col">
                <Image src="/assets/images/planet.png" alt="no prompts" width={256} height={256} />
                <span className="inline-block text-lg text-gray-500 mt-4">No prompts found!</span>
            </div>
    )
}
export default PromptCardList