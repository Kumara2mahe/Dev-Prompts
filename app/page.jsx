import { Suspense } from "react"
import Feed from "@components/Feed"
import PageStatus from "@components/PageStatus"

const Home = () => {
    return (
        <section className="w-full flex-center flex-col">
            <h1 className="head_text text-center">Share & Discover<br className="max-md:hidden" />
                <span className="greeny_blue_gradient text-center">AI Generated Prompts</span>
            </h1>
            <p className="desc text-center">Dev-Prompts is an open-source AI prompting tool for modern world to discover, create and share creative prompts.</p>
            <Suspense>
                <PageStatus />
                <Feed />
            </Suspense>
        </section>
    )
}
export default Home