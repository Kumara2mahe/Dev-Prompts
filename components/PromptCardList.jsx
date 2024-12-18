import Image from "next/image"

import PromptCard from "./PromptCard"
import PulseBar from "./PulseBar"

const PromptCardList = ({ data, handleTagClick, handleEdit, handleDelete }) => {
    return (
        data
            ? data.length > 0
                ? <div className="mt-16 prompt_layout gradient_prompt_card">
                    {data.map(prompt => (
                        <PromptCard
                            key={prompt.id}
                            prompt={prompt}
                            handleTagClick={handleTagClick}
                            handleEdit={() => handleEdit && handleEdit(prompt)}
                            handleDelete={e => handleDelete && handleDelete(e, prompt)}
                        />
                    ))
                    }
                </div>
                : <PulseBar />
            : <div className="my-16 pt-2 pb-4 flex-center flex-col">
                <Image src="/assets/images/planet.png" alt="no prompts" width={256} height={256} />
                <span className="inline-block text-lg text-gray-500 mt-4">No prompts found!</span>
            </div>
    )
}
export default PromptCardList