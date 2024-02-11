"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { signIn, signOut, useSession, getProviders } from "next-auth/react"

import { homePath, createPromptPath, profilePath } from "@utils/constants"
import DialogBox, { openDialog } from "./DialogBox"

const Navbar = () => {
    const { data: session } = useSession()
    const [providers, setProviders] = useState(null)
    const [dropDownOpened, setDropDownOpened] = useState(false)

    useEffect(() => {
        (async () => {
            const response = await getProviders()
            setProviders(response)
        })()
    }, [])

    const SignInButton = () => (
        <button className="black_btn" type="button" onClick={openDialog} data-parent-id={signInDialog}>Sign In</button>
    )
    return (
        <div className="flex-between w-full mb-16 pt-6">
            <Link className="flex gap-2 flex-center" href={homePath}>
                <Image className="object-contain" src="/assets/images/logo.svg" alt="Dev-Prompts" width={115} height={115} />
            </Link>
            <div className="sm:flex hidden">
                {session?.user
                    ? (
                        <div className="flex gap-3 md:gap:5">
                            <Link className="black_btn" href={createPromptPath}>Create Prompt</Link>
                            <button className="outline_btn" type="button" onClick={() => signOut({ callbackUrl: homePath })}>Sign Out</button>
                            <Link href={profilePath}>
                                <Image className="rounded-full" src={session.user.image && session.user.image != "" ? session.user.image : "/assets/icons/placeholder.png"} alt="profile" width={38} height={38} />
                            </Link>
                        </div>
                    ) : <SignInButton />
                }
            </div>

            <div className="sm:hidden flex relative">
                {session?.user
                    ? (
                        <div className="flex">
                            <Image
                                className="rounded-full" src={session.user.image && session.user.image != "" ? session.user.image : "/assets/icons/placeholder.png"} alt="profile" width={38} height={38}
                                onClick={() => setDropDownOpened(prev => !prev)}
                            />
                            {dropDownOpened && (
                                <div className="dropdown box_shadow_b1">
                                    <Link className="dropdown_link" href={profilePath} onClick={() => setDropDownOpened(false)}>My Profile</Link>
                                    <Link className="dropdown_link" href={createPromptPath} onClick={() => setDropDownOpened(false)}>Create Prompt</Link>
                                    <button className="mt-5 w-full black_btn" type="button" onClick={() => { setDropDownOpened(false); signOut({ callbackUrl: homePath }) }}>Sign Out</button>
                                </div>
                            )}
                        </div>
                    ) : <SignInButton />
                }
            </div>
            {providers &&
                <DialogBox id={signInDialog}>
                    <form id="signin" method="dialog" className="flex flex-col select-none" data-parent-id={signInDialog}>
                        <div className="flex flex-col justify-center items-center mb-6">
                            {providers && Object.values(providers).map((provider) => (
                                <button className={`signin_btn ${provider.id}`} type="button" key={provider.name} onClick={() => signIn(provider.id)}>
                                    <span className="btn_text"><span className="max-[480px]:hidden">Continue with</span> {provider.name}</span>
                                </button>
                            ))}
                        </div>
                    </form>
                </DialogBox>
            }
        </div>
    )
}
const signInDialog = "signin-dialog"
export default Navbar