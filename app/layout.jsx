import { ToastContainer, Flip } from "react-toastify"
import "react-toastify/dist/ReactToastify.min.css"

import "@styles/globals.css"
import Provider from "@components/Provider"
import Navbar from "@components/Navbar"
import { TOASTTIMER } from "@utils/constants"

export const metadata = {
    title: "Dev Prompts",
    description: "Share & Discover AI Generated Prompts"
}

const RootLayout = ({ children }) => {
    return (
        <html lang="en">
            <body>
                <Provider>
                    <main className="app">
                        <Navbar />
                        {children}
                        <ToastContainer stacked containerId={"app"} position="bottom-right" autoClose={TOASTTIMER} hideProgressBar={true}
                            newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss={false} draggable theme="light" transition={Flip} />
                    </main>
                </Provider>
            </body>
        </html>
    )
}
export default RootLayout