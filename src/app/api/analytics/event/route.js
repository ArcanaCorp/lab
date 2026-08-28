import { NextResponse } from "next/server";
import { createServerSupabase } from "../../../../lib/supabase/server";

export async function POST(request) {
    try {
        const supabase = createServerSupabase();

        const body = await request.json();

        const { visitorId, sessionToken, pageViewId, eventName, elementType, elementId, elementText, path, metadata } = body;

        if (!visitorId || !eventName) return NextResponse.json({ error: "visitorId y eventName son requeridos" }, { status: 400 });

        const { data: visitor, error: visitorError } =
            await supabase
                .from("analytics_visitors")
                .select("id")
                .eq("visitor_id", visitorId)
                .single();

        if (visitorError) {
            throw visitorError;
        }

        let sessionId = null;

        if (sessionToken) {
            const { data: session } = await supabase
                .from("analytics_sessions")
                .select("id")
                .eq("session_token", sessionToken)
                .maybeSingle();

            sessionId = session?.id ?? null;
        }

        const { data, error } = await supabase
            .from("analytics_events")
            .insert({
                visitor_id: visitor.id,
                session_id: sessionId,
                page_view_id: pageViewId || null,
                event_name: eventName,
                element_type: elementType,
                element_id: elementId,
                element_text: elementText,
                path,
                metadata: metadata || {},
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        const { error: eventError } = await supabase.rpc("increment_visitor_events", {
            visitor_uuid: visitor.id,
        });

        if (eventError) {
            console.error(
                "Error incrementando eventos del visitante:",
                eventError
            );
        }

        return NextResponse.json({
            event: data,
        });

    } catch (error) {
        console.error("Analytics event error:", error);
        return NextResponse.json({ error: "No se pudo registrar el evento" }, { status: 500 });
    }
}