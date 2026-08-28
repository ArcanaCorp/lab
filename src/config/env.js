export const SUPABASE = {
    URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    KEY: process.env.NEXT_PUBLIC_SUPABASE_KEY,
    ROL: process.env.NEXT_PUBLIC_SUPABASE_ROL
}

export const BASE_URL = process.env.NEXT_PUBLIC_ENV === 'development' ? 'http://localhost:3000' : 'https://alglab.arcanacorp.dev'