import { NextResponse } from "next/server";
import { createServerSupabase } from "../../../../lib/supabase/server";

export async function POST(request) {

    try {

        const supabaseAdmin = createServerSupabase();

        const body = await request.json();

        const {
            project,
        } = body;

        if (!project) {
            return NextResponse.json(
                {
                    error: "Proyecto requerido",
                },
                {
                    status: 400,
                }
            );
        }

        const {
            slug,
            title,
            source,
        } = project;

        if (!slug) {
            return NextResponse.json(
                {
                    error: "El slug del proyecto es requerido",
                },
                {
                    status: 400,
                }
            );
        }

        /*
         * Buscar si ya existe
         */

        const {
            data: existingProject,
            error: findError,
        } = await supabaseAdmin
            .from("projects")
            .select("id, slug")
            .eq("slug", slug)
            .maybeSingle();

        if (findError) {
            throw findError;
        }

        /*
         * Actualizar proyecto existente
         */

        if (existingProject) {

            const {
                data: updatedProject,
                error: updateError,
            } = await supabaseAdmin
                .from("projects")
                .update({
                    title: title || "Sin título",
                    source: source || "",
                    updated_at: new Date().toISOString(),
                })
                .eq("id", existingProject.id)
                .select()
                .single();

            if (updateError) {
                throw updateError;
            }

            return NextResponse.json({
                success: true,
                created: false,
                project: updatedProject,
            });
        }

        /*
         * Crear proyecto
         */

        const {
            data: newProject,
            error: insertError,
        } = await supabaseAdmin
            .from("projects")
            .insert({
                slug,
                title: title || "Sin título",
                source: source || "",
            })
            .select()
            .single();

        if (insertError) {
            throw insertError;
        }

        return NextResponse.json({
            success: true,
            created: true,
            project: newProject,
        });

    } catch (error) {

        console.error(
            "POST /api/projects/sync:",
            error
        );

        return NextResponse.json(
            {
                error:
                    error?.message ||
                    "No se pudo sincronizar el proyecto",
            },
            {
                status: 500,
            }
        );
    }
}