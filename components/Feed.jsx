"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"

import PromptCardList from "./PromptCardList"

const Feed = () => {
    const [prompts, setPrompts] = useState([])
    const [searchText, setSearchText] = useState("")
    const [searchTimeout, setSearchTimeout] = useState(null)
    const [searchedResults, setSearchedResults] = useState([])
    const [clearButton, setClearButton] = useState(false)

    useEffect(() => {
        (async () => {
            const response = await fetch("/api/prompt")
            if (response.ok) {
                const data = await response.json()
                if (data.length > 0) {
                    return setPrompts(data)
                }
            }
            setPrompts(null)
        })()
    }, [])

    // Filter prompts by searchquery
    const emptyPrompt = useRef(null)
    const searchParams = useSearchParams()
    const qTag = searchParams.get("qTag")
    useEffect(() => {
        if (emptyPrompt.current === null && prompts.length > 0) {
            emptyPrompt.current = prompts.length
            qTag && setTimeout(() => handleTagClick(qTag), 500)
        }
    }, [prompts])

    // Toggle clear button visibility
    useEffect(() => {
        setClearButton(searchText !== "")
    }, [searchText])

    const handleSearchChange = (e) => {
        clearTimeout(searchTimeout)
        setSearchText(e.target.value)

        const _timeout = setTimeout(() => {
            const searchResult = filterPrompts(e.target.value, prompts)
            setSearchedResults(searchResult)
        }, 500)
        setSearchTimeout(_timeout)
    }
    const handleTagClick = (tagName) => {
        setSearchText(tagName)
        const searchResult = filterPrompts(tagName, prompts, "tag")
        setSearchedResults(searchResult)
    }
    return (
        <section className="feed">
            <form className="relative w-full flex-center" onSubmit={e => e.preventDefault()}>
                <input
                    className="search_input peer"
                    type="text"
                    placeholder="Search for a tag or a name"
                    value={searchText}
                    onChange={handleSearchChange}
                />
                {clearButton && <button className="rounded-full absolute inset-y right-2 z-[2]" id="clear-btn" onClick={() => setSearchText("")}>
                    <svg className="rounded-full group" width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <path className="fill-purple-400 opacity-40 group-hover:opacity-60 group-active:fill-purple-500" d="M14.34 -0.000244141H5.67C2.28 -0.000244141 0 2.37976 0 5.91976V14.0898C0 17.6198 2.28 19.9998 5.67 19.9998H14.34C17.73 19.9998 20 17.6198 20 14.0898V5.91976C20 2.37976 17.73 -0.000244141 14.34 -0.000244141Z" />
                            <path className="fill-purple-800 group-active:fill-purple-950" d="M13.0156 11.7703L11.2366 9.99226L13.0146 8.21426C13.3566 7.87326 13.3566 7.31826 13.0146 6.97726C12.6726 6.63326 12.1196 6.63426 11.7776 6.97626L9.99858 8.75426L8.21958 6.97426C7.87758 6.63226 7.32358 6.63426 6.98158 6.97426C6.64058 7.31626 6.64058 7.87126 6.98158 8.21226L8.76158 9.99226L6.98558 11.7673C6.64358 12.1093 6.64358 12.6643 6.98558 13.0043C7.15658 13.1763 7.37958 13.2613 7.60358 13.2613C7.82858 13.2613 8.05158 13.1763 8.22258 13.0053L9.99858 11.2293L11.7786 13.0083C11.9496 13.1793 12.1726 13.2643 12.3966 13.2643C12.6206 13.2643 12.8446 13.1783 13.0156 13.0083C13.3576 12.6663 13.3576 12.1123 13.0156 11.7703Z" />
                        </g>
                    </svg>
                </button>}
            </form>
            <PromptCardList data={searchText ? searchedResults : prompts} handleTagClick={handleTagClick} />
        </section>
    )
}
const filterPrompts = (searchtext, allPrompts, by = "") => {
    const regex = new RegExp(searchtext, "i")
    return allPrompts.filter((item) => {
        if (by === "tag") {
            return regex.test(item.tag)
        }
        else {
            return regex.test(item.creator.name) ||
                regex.test(item.tag) ||
                regex.test(item.snippet)
        }
    })
}
export default Feed