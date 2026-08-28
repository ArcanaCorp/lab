import { NextResponse } from "next/server";
import { createServerSupabase } from "../../../../lib/supabase/server";

export async function POST(request) {
    try {
        const supabase = createServerSupabase();

        const body = await request.json();

        const { visitorId, landingPage, referrer, language, timezone, deviceType, browser, browserVersion, os, osVersion } = body;

        if (!visitorId) return NextResponse.json({ error: "visitorId es requerido" }, { status: 400 });

        const { data: existingVisitor, error: findError } = await supabase
            .from("analytics_visitors")
            .select("id, total_sessions, total_page_views, total_events")
            .eq("visitor_id", visitorId)
            .maybeSingle();

        if (findError) throw findError;

        if (existingVisitor) {
            const { data, error } = await supabase
                .from("analytics_visitors")
                .update({
                    last_seen_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .eq("id", existingVisitor.id)
                .select()
                .single();

            if (error) {
                throw error;
            }

            return NextResponse.json({ visitor: data, isNew: false });
        }

        const { data, error } = await supabase
            .from("analytics_visitors")
            .insert({
                visitor_id: visitorId,
                first_landing_page: landingPage,
                first_referrer: referrer,
                language,
                timezone,
                device_type: deviceType,
                browser,
                browser_version: browserVersion,
                os,
                os_version: osVersion,
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({visitor: data, isNew: true});
    } catch (error) {
        console.error("Analytics visitor error:", error);
        return NextResponse.json({error: "No se pudo registrar el visitante"}, {status: 500});
    }
}