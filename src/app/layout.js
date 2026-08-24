import { Google_Sans_Code } from "next/font/google";
import '../styles/globals.css'

const sansCode = Google_Sans_Code({
    variable: '--font-sans-code',
    weight: ["300", "400", "500", "600", "700", "800"],
    subsets: ["latin"]
})

export const metadata = {
    title: 'AlgLab'
}

export default function RootLayout({ children }) {
    return (
        <html lang="es" className={`${sansCode.className}`} data-scroll-behavior="smooth">
            <body>
                {children}
            </body>
        </html>
    )
}