import crypto from "crypto";
import { NextResponse } from "next/server";
import { createServerSupabase } from "../../../../lib/supabase/server";

function generateShortCode() {
    return crypto
        .randomBytes(6)
        .toString("base64url");
}

export async function POST(request) {
    try {
        const supabase = createServerSupabase();

        const body = await request.json();

        const { visitorId, resourceType, resourceId, sourcePath } = body;

        if ( !visitorId || !resourceType || !resourceId) return NextResponse.json({error: "Datos incompletos"}, {status: 400});

        const { data: visitor, error: visitorError } =
            await supabase
                .from("analytics_visitors")
                .select("id")
                .eq("visitor_id", visitorId)
                .single();

        if (visitorError) {
            throw visitorError;
        }

        const shortCode = generateShortCode();

        const { data, error } = await supabase
            .from("analytics_shared_links")
            .insert({
                short_code: shortCode,
                created_by_visitor_id: visitor.id,
                resource_type: resourceType,
                resource_id: resourceId,
                source_path: sourcePath,
                target_url: `${resourceId}`,
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

        return NextResponse.json({
            share: data,
            url: `${origin}/s/${shortCode}`,
        });
        
    } catch (error) {
        console.error("Analytics share error:", error);
        return NextResponse.json( { error: "No se pudo crear el enlace" }, { status: 500 });
    }
}