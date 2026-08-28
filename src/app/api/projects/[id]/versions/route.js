import { NextResponse } from "next/server";
import { createServerSupabase } from "../../../../../lib/supabase/server";

const supabaseAdmin = createServerSupabase();

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const { data, error } = await supabaseAdmin
            .from("project_versions")
            .select("*")
            .eq("project_id", id)
            .order("version", {
                ascending: false,
            });

        if (error) throw error;

        return NextResponse.json({
            versions: data,
        });

    } catch (error) {
        console.error("GET versions:", error);

        return NextResponse.json(
            {
                error: "No se pudieron obtener las versiones",
            },
            { status: 500 }
        );
    }
}