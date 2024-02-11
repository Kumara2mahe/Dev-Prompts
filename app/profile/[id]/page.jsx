"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { redirect } from "next/navigation"

import UserProfile from "@components/UserProfile"
import { profilePath } from "@utils/constants"

const Profile = ({ params }) => {
    const { data: session } = useSession()
    useEffect(() => {
        session?.user.id === params?.id && redirect(profilePath)
    }, [session])

    const [userPrompts, setUserPrompts] = useState([])
    useEffect(() => {
        const fetchPrompts = async () => {
            const response = await fetch(`/api/users/${params.id}/posts`)
            if (response.ok) {
                const data = await response.json()
                if (data.length > 0) {
                    return setUserPrompts(data)
                }
            }
            setUserPrompts(null)
        }
        params?.id && fetchPrompts()
    }, [params.id])
    return (
        <UserProfile
            userid={params.id}
            desc="Explore prompts and be inspired by the power of their creativity."
            data={userPrompts}
        />
    )
}

export default Profile