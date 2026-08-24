import { Google_Sans_Code } from 'next/font/google'
import '../styles/globals.css'

const googleSansCode = Google_Sans_Code({ 
    subsets: ['latin'],
    variable: '--font-google-sans-code',
    weight: ['400', '500', '600', '700'],
})

export const metadata = {
    title: 'AlgLab'
}

export default function RootLayout({ children }) {
    return (
        <html lang="es" className={googleSansCode.variable} data-scroll-behavior="smooth">
            <body>
                {children}
            </body>
        </html>
    )
}
