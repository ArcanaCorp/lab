import { NextResponse } from "next/server";
import { createServerSupabase } from "../../../../lib/supabase/server";

export async function POST(request) {
    try {
        const supabase = createServerSupabase();

        const body = await request.json();

        const { visitorId, sessionToken, path, pageTitle, referrer } = body;

        if (!visitorId || !path) return NextResponse.json({error: "visitorId y path son requeridos"}, {status: 400});

        const { data: visitor } = await supabase
            .from("analytics_visitors")
            .select("id")
            .eq("visitor_id", visitorId)
            .single();

        if (!visitor) return NextResponse.json({error: "Visitante no encontrado"}, {status: 404});

        let session = null;

        if (sessionToken) {
            const { data } = await supabase
                .from("analytics_sessions")
                .select("id")
                .eq("session_token", sessionToken)
                .maybeSingle();

            session = data;
        }

        const { data, error } = await supabase
            .from("analytics_page_views")
            .insert({
                visitor_id: visitor.id,
                session_id: session?.id ?? null,
                path,
                page_title: pageTitle,
                referrer,
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        const { error: pageViewError } = await supabase.rpc("increment_visitor_page_views", {
            visitor_uuid: visitor.id,
        });

        if (pageViewError) {
            console.error("Error incrementando page views:", pageViewError);
        }

        return NextResponse.json({
            pageView: data,
        });

    } catch (error) {
        console.error("Analytics page view error:", error);
        return NextResponse.json({ error: "No se pudo registrar la página" }, { status: 500 });
    }
}