import { SUPABASE } from "../../config/env";
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
    return createBrowserClient(SUPABASE.URL, SUPABASE.KEY);
}