import PromptCardList from "./PromptCardList"

const UserProfile = ({ name, desc, data, handleEdit, handleDelete }) => {
    return (
        <section className="w-full">
            <h1 className="head_text text-left">
                <span className="bluey_violet_gradient">{name}</span>
            </h1>
            {desc && <p className="desc text-left">{desc}</p>}
            <PromptCardList data={data} handleEdit={handleEdit} handleDelete={handleDelete} />
        </section>
    )
}
export default UserProfile