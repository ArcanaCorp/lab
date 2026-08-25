import { Google_Sans_Code } from 'next/font/google';
import '../styles/globals.css';

const googleSansCode = Google_Sans_Code({
    subsets: ['latin'],
    variable: '--font-google-sans-code',
    weight: ['400', '500', '600', '700'],
});

export const metadata = {
    metadataBase: new URL('https://alglab.arcanacorp.dev'),
    title: {
        default: 'AlgLab | Aprende y practica algoritmos',
        template: '%s | AlgLab',
    },
    description: 'AlgLab es una plataforma interactiva para aprender, practicar y ejecutar algoritmos y pseudocódigo de forma sencilla.',
    applicationName: 'AlgLab',
    keywords: [
        'AlgLab',
        'algoritmos',
        'pseudocódigo',
        'aprender algoritmos',
        'programación',
        'programación para principiantes',
        'lógica de programación',
        'ejercicios de algoritmos',
        'editor de pseudocódigo',
        'ejecutar pseudocódigo',
        'diagramas de flujo',
        'educación informática',
    ],
    authors: [
        {
            name: 'AlgLab',
        },
    ],
    creator: 'AlgLab',
    publisher: 'AlgLab',
    category: 'education',
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'es_ES',
        url: 'https://alglab.arcanacorp.dev',
        siteName: 'AlgLab',
        title: 'AlgLab | Aprende y practica algoritmos',
        description: 'Aprende, escribe y ejecuta algoritmos y pseudocódigo de forma interactiva.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'AlgLab - Aprende y practica algoritmos',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AlgLab | Aprende y practica algoritmos',
        description: 'Aprende, escribe y ejecuta algoritmos y pseudocódigo de forma interactiva.',
        images: ['/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
        },
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.webmanifest',
};

export default function RootLayout({ children }) {
    return (
        <html lang="es" className={googleSansCode.variable} data-scroll-behavior="smooth">
            <body>
                {children}
            </body>
        </html>
    );
}