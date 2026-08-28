import { NextResponse } from "next/server";
import { createServerSupabase } from "../../../../lib/supabase/server";

export async function POST(request) {
    try {
        const body = await request.json();

        const {
            visitorId,
            sessionToken,
            landingPage,
            referrer,
            utmSource,
            utmMedium,
            utmCampaign,
            utmTerm,
            utmContent,
        } = body;

        if (!visitorId) {
            return NextResponse.json(
                {
                    error: "visitorId es requerido",
                },
                {
                    status: 400,
                }
            );
        }

        if (!sessionToken) {
            return NextResponse.json(
                {
                    error: "sessionToken es requerido",
                },
                {
                    status: 400,
                }
            );
        }

        const supabase =
            createServerSupabase();

        /*
        |--------------------------------------------------------------------------
        | 1. Buscar visitante por visitor_id de FingerprintJS
        |--------------------------------------------------------------------------
        */

        const {
            data: visitor,
            error: visitorError,
        } = await supabase
            .from("analytics_visitors")
            .select("id, visitor_id")
            .eq(
                "visitor_id",
                visitorId
            )
            .maybeSingle();

        if (visitorError) {
            console.error(
                "Error buscando visitante:",
                visitorError
            );

            throw visitorError;
        }

        if (!visitor) {
            return NextResponse.json(
                {
                    error:
                        "El visitante no existe",
                },
                {
                    status: 404,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 2. Buscar sesión existente
        |--------------------------------------------------------------------------
        */

        const {
            data: existingSession,
            error: sessionError,
        } = await supabase
            .from("analytics_sessions")
            .select("*")
            .eq(
                "session_token",
                sessionToken
            )
            .maybeSingle();

        if (sessionError) {
            console.error(
                "Error buscando sesión:",
                sessionError
            );

            throw sessionError;
        }

        if (existingSession) {
            return NextResponse.json({
                session:
                    existingSession,

                isNew: false,
            });
        }

        /*
        |--------------------------------------------------------------------------
        | 3. Crear sesión usando analytics_visitors.id
        |--------------------------------------------------------------------------
        */

        const {
            data: session,
            error: insertError,
        } = await supabase
            .from("analytics_sessions")
            .insert({
                visitor_id:
                    visitor.id,

                session_token:
                    sessionToken,

                landing_page:
                    landingPage,

                referrer,

                utm_source:
                    utmSource,

                utm_medium:
                    utmMedium,

                utm_campaign:
                    utmCampaign,

                utm_term:
                    utmTerm,

                utm_content:
                    utmContent,
            })
            .select()
            .single();

        if (insertError) {
            /*
            |--------------------------------------------------------------------------
            | Otro request pudo crear la misma sesión
            |--------------------------------------------------------------------------
            */

            if (
                insertError.code ===
                "23505"
            ) {
                const {
                    data: existing,
                    error:
                        retryError,
                } = await supabase
                    .from(
                        "analytics_sessions"
                    )
                    .select("*")
                    .eq(
                        "session_token",
                        sessionToken
                    )
                    .single();

                if (retryError) {
                    throw retryError;
                }

                return NextResponse.json({
                    session: existing,

                    isNew: false,
                });
            }

            console.error(
                "Error creando sesión:",
                insertError
            );

            throw insertError;
        }

        /*
        |--------------------------------------------------------------------------
        | 4. Actualizar estadísticas del visitante
        |--------------------------------------------------------------------------
        */

        await supabase
            .from("analytics_visitors")
            .update({
                total_sessions:
                    visitor.total_sessions
                        ? visitor.total_sessions + 1
                        : 1,

                updated_at:
                    new Date().toISOString(),
            })
            .eq(
                "id",
                visitor.id
            );

        return NextResponse.json({
            session,

            isNew: true,
        });
    } catch (error) {
        console.error(
            "Analytics session error:",
            error
        );

        return NextResponse.json(
            {
                error:
                    error?.message ||
                    "No se pudo crear la sesión",
            },
            {
                status: 500,
            }
        );
    }
}