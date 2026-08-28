import { SUPABASE } from "../../config/env";
import { createClient } from "@supabase/supabase-js";

export function createServerSupabase() {
    return createClient(SUPABASE.URL, SUPABASE.ROL,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}