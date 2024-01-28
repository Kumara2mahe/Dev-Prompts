"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"

import PromptCardList from "./PromptCardList"

const Feed = () => {
    const [prompts, setPrompts] = useState([])
    const [searchText, setSearchText] = useState("")
    const [searchTimeout, setSearchTimeout] = useState(null)
    const [searchedResults, setSearchedResults] = useState([])

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
            <form className="relative w-full flex-center">
                <input
                    className="search_input peer"
                    type="text"
                    placeholder="Search for a tag or a name"
                    value={searchText}
                    onChange={handleSearchChange}
                    required
                />
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