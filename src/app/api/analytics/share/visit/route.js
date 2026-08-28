import { NextResponse } from "next/server";
import { createServerSupabase } from "../../../../../lib/supabase/server";

export async function POST(request) {
    try {

        const { code, visitorId, referrer } = await request.json();

        if (!code) return NextResponse.json({error: "Código requerido"}, {status: 400});

        if (!visitorId) return NextResponse.json({error: "Visitor ID requerido"}, {status: 400});

        const supabase = createServerSupabase();

        /*
        |--------------------------------------------------------------------------
        | 1. Buscar shared link
        |--------------------------------------------------------------------------
        */

        const { data: sharedLink, error: linkError } = await supabase
            .from(
                "analytics_shared_links"
            )
            .select(`
                id,
                short_code,
                created_by_visitor_id,
                created_by_user_id,
                resource_type,
                resource_id,
                source_path,
                target_url,
                expires_at,
                is_active,
                total_visits,
                unique_visitors
            `)
            .eq(
                "short_code",
                code
            )
            .maybeSingle();

        if (linkError) {
            console.error("Error buscando shared link:", linkError);
            return NextResponse.json({ error: "Error buscando enlace" }, { status: 500 });
        }

        /*
        |--------------------------------------------------------------------------
        | 2. No existe
        |--------------------------------------------------------------------------
        */

        if (!sharedLink) return NextResponse.json({error: "Enlace no encontrado"}, {status: 404 });

        /*
        |--------------------------------------------------------------------------
        | 3. Desactivado
        |--------------------------------------------------------------------------
        */

        if (!sharedLink.is_active) return NextResponse.json({error: "Este enlace ya no está activo"}, {status: 410});

        /*
        |--------------------------------------------------------------------------
        | 4. Expirado
        |--------------------------------------------------------------------------
        */

        if (sharedLink.expires_at && new Date(sharedLink.expires_at) <= new Date()) return NextResponse.json({ error: "Este enlace ha expirado" }, { status: 410 });

        /*
        |--------------------------------------------------------------------------
        | 5. Buscar visitante
        |--------------------------------------------------------------------------
        */

        const { data: existingVisitor, error: visitorError } = await supabase
            .from(
                "analytics_visitors"
            )
            .select(`
                id,
                visitor_id
            `)
            .eq(
                "visitor_id",
                visitorId
            )
            .maybeSingle();

        if (visitorError) {
            throw visitorError;
        }

        let visitor = existingVisitor;

        /*
        |--------------------------------------------------------------------------
        | 6. Crear visitante si no existe
        |--------------------------------------------------------------------------
        */

        if (!visitor) {

            const { data: newVisitor, error: newVisitorError } = await supabase
                .from(
                    "analytics_visitors"
                )
                .insert({
                    visitor_id:
                        visitorId,
                })
                .select(`
                    id,
                    visitor_id
                `)
                .single();

            if (newVisitorError) {

                if (newVisitorError.code === "23505") {
                    const {data: retryVisitor, error: retryError } = await supabase
                        .from(
                            "analytics_visitors"
                        )
                        .select(`
                            id,
                            visitor_id
                        `)
                        .eq(
                            "visitor_id",
                            visitorId
                        )
                        .single();

                    if (retryError) {
                        throw retryError;
                    }

                    visitor = retryVisitor;
                } else {
                    throw newVisitorError;
                }

            } else {
                visitor =
                    newVisitor;
            }
        }

        /*
        |--------------------------------------------------------------------------
        | 7. Determinar si es el creador
        |--------------------------------------------------------------------------
        */

        const isCreator = sharedLink.created_by_visitor_id === visitor.id;

        /*
        |--------------------------------------------------------------------------
        | 8. Buscar sesión activa
        |--------------------------------------------------------------------------
        |
        | Aquí usamos session_token si lo estás
        | almacenando en cookie/localStorage.
        |
        */

        const sessionToken = request.headers.get("x-session-token");

        let sessionId = null;

        if (sessionToken) {
            const { data: session } = await supabase
                .from(
                    "analytics_sessions"
                )
                .select("id")
                .eq(
                    "session_token",
                    sessionToken
                )
                .eq(
                    "visitor_id",
                    visitor.id
                )
                .maybeSingle();

            sessionId = session?.id || null;
        }

        /*
        |--------------------------------------------------------------------------
        | 9. Determinar si es nuevo visitante para este share
        |--------------------------------------------------------------------------
        */

        const { count: previousVisits, error: previousError } = await supabase
            .from(
                "analytics_shared_link_visits"
            )
            .select(
                "id",
                {
                    count: "exact",
                    head: true,
                }
            )
            .eq(
                "shared_link_id",
                sharedLink.id
            )
            .eq(
                "visitor_id",
                visitor.id
            );

        if (previousError) {
            throw previousError;
        }

        const isNewVisitor = previousVisits === 0;

        /*
        |--------------------------------------------------------------------------
        | 10. Registrar visita
        |--------------------------------------------------------------------------
        */

        const { error: visitError } = await supabase
            .from(
                "analytics_shared_link_visits"
            )
            .insert({
                shared_link_id: sharedLink.id,
                visitor_id: visitor.id,
                session_id: sessionId,
                visited_at: new Date().toISOString(),
                referrer: referrer || null,
                is_new_visitor: isNewVisitor,
                is_creator: isCreator,
            });

        if (visitError) {
            throw visitError;
        }

        /*
        |--------------------------------------------------------------------------
        | 11. Actualizar total_visits
        |--------------------------------------------------------------------------
        */

        await supabase
            .from(
                "analytics_shared_links"
            )
            .update({
                total_visits: sharedLink.total_visits + 1,
                unique_visitors: sharedLink.unique_visitors + (isNewVisitor ? 1 : 0),
            })
            .eq(
                "id",
                sharedLink.id
            );

        /*
        |--------------------------------------------------------------------------
        | 12. Resolver destino
        |--------------------------------------------------------------------------
        */

        let destination = sharedLink.target_url;

        /*
        |--------------------------------------------------------------------------
        | 13. Si no existe target_url,
        |     resolver según resource_type
        |--------------------------------------------------------------------------
        */

        if (!destination) {
            switch (sharedLink.resource_type) {
                case "page":
                    destination = sharedLink.resource_id;
                    break;
                default:
                    destination = sharedLink.source_path;
            }
        }

        if (!destination) {
            return NextResponse.json(
                {
                    error: "No se pudo determinar el destino",
                },
                {
                    status: 400,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 14. Respuesta
        |--------------------------------------------------------------------------
        */

        return NextResponse.json({
            success: true,

            destination,

            share: {
                id: sharedLink.id,

                shortCode:
                    sharedLink.short_code,

                resourceType:
                    sharedLink.resource_type,
            },
        });
    } catch (error) {
        console.error(
            "Shared link visit error:",
            error
        );

        return NextResponse.json(
            {
                error:
                    error?.message ||
                    "No se pudo procesar el enlace",
            },
            {
                status: 500,
            }
        );
    }
}