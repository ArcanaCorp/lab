import '../styles/globals.css'

export const metadata = {
    title: 'AlgLab'
}

export default function RootLayout({ children }) {
    return (
        <html lang="es" data-scroll-behavior="smooth">
            <body>
                {children}
            </body>
        </html>
    )
}
