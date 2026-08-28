import { NextResponse } from "next/server";
import { createServerSupabase } from "../../../../lib/supabase/server";
import { BASE_URL } from "../../../../config/env";

function generateShortCode(length = 8) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function POST(request) {

    const supabaseAdmin = createServerSupabase();

    try {

        const body = await request.json();

        const { projectId, sourcePath = null } = body;

        if (!projectId) return NextResponse.json( {error: "projectId es requerido"}, {status: 400 });

        /*
         * -----------------------------------------
         * 1. Buscar proyecto
         * -----------------------------------------
         */

        const { data: project, error: projectError } = await supabaseAdmin
            .from("projects")
            .select(`
                id,
                slug,
                title,
                is_public
            `)
            .eq("slug", projectId)
            .maybeSingle();

        if (projectError) throw projectError;

        if (!project) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });

        /*
         * -----------------------------------------
         * 2. Buscar si ya tiene un enlace
         * -----------------------------------------
         *
         * resource_type = project
         * resource_id   = projects.id
         *
         */

        const { data: existingShare, error: existingShareError } = await supabaseAdmin
            .from("analytics_shared_links")
            .select("*")
            .eq("resource_type", "project")
            .eq("resource_id", project.id)
            .eq("is_active", true)
            .maybeSingle();

        if (existingShareError) throw existingShareError;

        /*
         * -----------------------------------------
         * 3. Si ya existe, reutilizarlo
         * -----------------------------------------
         */

        if (existingShare) {

            const url = `${BASE_URL}/s/${existingShare.short_code}`;

            return NextResponse.json({
                success: true,
                created: false,
                share: existingShare,
                url,
                destination: `/editor/${project.slug}`,
            });
        }

        /*
         * -----------------------------------------
         * 4. Generar short code
         * -----------------------------------------
         */

        let shortCode = null;

        for (let attempt = 0; attempt < 5; attempt++) {

            const candidate = generateShortCode();

            const { data: exists } = await supabaseAdmin
                .from("analytics_shared_links")
                .select("id")
                .eq("short_code", candidate)
                .maybeSingle();

            if (!exists) {
                shortCode = candidate;
                break;
            }
        }

        if (!shortCode) throw new Error("No se pudo generar un código único");

        /*
         * -----------------------------------------
         * 5. Crear enlace
         * -----------------------------------------
         */

        const { data: share, error: shareError } = await supabaseAdmin
            .from("analytics_shared_links")
            .insert({
                short_code: shortCode,
                resource_type: "project",
                resource_id: project.id,
                source_path: sourcePath,
                target_url: `/editor/${project.slug}`,
                is_active: true,
            })
            .select()
            .single();

        if (shareError) throw shareError;

        /*
         * -----------------------------------------
         * 6. URL pública
         * -----------------------------------------
         */

        const url = `${BASE_URL}/s/${share.short_code}`;

        /*
         * -----------------------------------------
         * 7. Respuesta
         * -----------------------------------------
         */

        return NextResponse.json({
            success: true,
            created: true,
            share,
            url,
            destination: `/editor/${project.slug}`,
        });

    } catch (error) {
        console.error("POST /api/projects/share:", error);
        return NextResponse.json({ error: error?.message || "No se pudo crear el enlace" }, { status: 500 });
    }
}