import { NextResponse } from "next/server";
import { createServerSupabase } from "../../../lib/supabase/server";

export async function POST(request) {
    try {

        const supabaseAdmin = createServerSupabase();

        const body = await request.json();

        const { slug, title = "Sin título", source = "", visitorId, userId = null } = body;

        if (!slug) {
            return NextResponse.json(
                { error: "El slug es obligatorio" },
                { status: 400 }
            );
        }

        if (!visitorId && !userId) {
            return NextResponse.json(
                { error: "No se pudo identificar al propietario" },
                { status: 400 }
            );
        }

        // Evitar duplicar el mismo proyecto
        const { data: existing } = await supabaseAdmin
            .from("projects")
            .select("*")
            .eq("slug", slug)
            .maybeSingle();

        if (existing) {
            return NextResponse.json({
                project: existing,
                alreadyExists: true,
            });
        }

        let visitor = null;

        if (visitorId) {
            const { data, error } = await supabaseAdmin
                .from("analytics_visitors")
                .select("id")
                .eq("visitor_id", visitorId)
                .maybeSingle();

            if (error) throw error;

            visitor = data;
        }

        // Crear proyecto
        const { data: project, error: projectError } =
            await supabaseAdmin
                .from("projects")
                .insert({
                    slug,
                    title,
                    source,
                    owner_user_id: userId,
                    owner_visitor_id: visitor?.id ?? null,
                    version: 1,
                })
                .select()
                .single();

        if (projectError) throw projectError;

        // Crear versión inicial
        const { error: versionError } = await supabaseAdmin
            .from("project_versions")
            .insert({
                project_id: project.id,
                version: 1,
                title,
                source,
                created_by_user_id: userId,
                created_by_visitor_id: visitor?.id ?? null,
            });

        if (versionError) throw versionError;

        // Agregar propietario como miembro
        const { error: memberError } = await supabaseAdmin
            .from("project_members")
            .insert({
                project_id: project.id,
                user_id: userId,
                visitor_id: visitor?.id ?? null,
                role: "owner",
            });

        if (memberError) throw memberError;

        // Registrar sincronización
        const { error: syncError } = await supabaseAdmin
            .from("project_syncs")
            .insert({
                project_id: project.id,
                user_id: userId,
                visitor_id: visitor?.id ?? null,
                version: 1,
                sync_type: "upload",
            });

        if (syncError) throw syncError;

        return NextResponse.json(
            {
                project,
                alreadyExists: false,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("POST /api/projects:", error);

        return NextResponse.json(
            {
                error: error.message || "No se pudo subir el proyecto",
            },
            { status: 500 }
        );
    }
}