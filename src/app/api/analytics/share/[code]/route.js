import { redirect, notFound } from "next/navigation";
import { createServerSupabase } from "../../../../lib/supabase/server";

export default async function SharedLinkPage({ params }) {
    const { code } = await params;

    const supabase = createServerSupabase();

    const { data: share } = await supabase
        .from("analytics_shared_links")
        .select("*")
        .eq("short_code", code)
        .eq("is_active", true)
        .single();

    if (!share) {
        notFound();
    }

    await supabase
        .from("analytics_shared_link_visits")
        .insert({
            shared_link_id: share.id,
        });

    redirect(share.target_url);
}