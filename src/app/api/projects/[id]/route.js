import { NextResponse } from "next/server";
import { createServerSupabase } from "../../../../lib/supabase/server";

const supabaseAdmin = createServerSupabase();

export async function GET(request, { params }) {
    const supabase = createServerSupabase();

    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { error: "Slug requerido" },
                { status: 400 }
            );
        }

        const { data: project, error } = await supabase
            .from("projects")
            .select(`
                id,
                slug,
                title,
                source,
                version,
                is_public,
                created_at,
                updated_at
            `)
            .eq("slug", id)
            .maybeSingle();

        if (error) {
            console.error("GET /api/projects/[id]:", error);

            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        if (!project) {
            return NextResponse.json(
                { error: "Proyecto no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            project,
        });

    } catch (error) {
        console.error("GET /api/projects/[id]:", error);

        return NextResponse.json(
            { error: error?.message || "Error obteniendo proyecto" },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;

        const body = await request.json();

        const { title = "Sin título", source = "", visitorId, userId = null, version } = body;

        // Obtener proyecto actual
        const { data: project, error: projectError } =
            await supabaseAdmin
                .from("projects")
                .select("*")
                .eq("id", id)
                .single();

        if (projectError) throw projectError;

        // Control básico de concurrencia
        if (
            version !== undefined &&
            Number(version) !== project.version
        ) {
            return NextResponse.json(
                {
                    error: "El proyecto fue modificado desde otra sesión",
                    code: "VERSION_CONFLICT",
                    currentVersion: project.version,
                },
                { status: 409 }
            );
        }

        const newVersion = project.version + 1;

        let visitor = null;

        if (visitorId) {
            const { data } = await supabaseAdmin
                .from("analytics_visitors")
                .select("id")
                .eq("visitor_id", visitorId)
                .maybeSingle();

            visitor = data;
        }

        // Actualizar proyecto
        const { data: updatedProject, error: updateError } =
            await supabaseAdmin
                .from("projects")
                .update({
                    title,
                    source,
                    version: newVersion,
                    updated_at: new Date().toISOString(),
                    last_synced_at: new Date().toISOString(),
                    last_modified_by_user_id: userId,
                    last_modified_by_visitor_id: visitor?.id ?? null,
                })
                .eq("id", id)
                .select()
                .single();

        if (updateError) throw updateError;

        // Crear nueva versión
        const { error: versionError } = await supabaseAdmin
            .from("project_versions")
            .insert({
                project_id: id,
                version: newVersion,
                title,
                source,
                created_by_user_id: userId,
                created_by_visitor_id: visitor?.id ?? null,
            });

        if (versionError) throw versionError;

        // Registrar sync
        const { error: syncError } = await supabaseAdmin
            .from("project_syncs")
            .insert({
                project_id: id,
                user_id: userId,
                visitor_id: visitor?.id ?? null,
                version: newVersion,
                sync_type: "update",
            });

        if (syncError) throw syncError;

        return NextResponse.json({
            project: updatedProject,
        });

    } catch (error) {
        console.error("PUT /api/projects/[id]:", error);

        return NextResponse.json(
            {
                error: error.message || "No se pudo actualizar el proyecto",
            },
            { status: 500 }
        );
    }
}