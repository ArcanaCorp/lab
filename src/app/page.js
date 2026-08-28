'use client';
import Link from "next/link";
import { useAnalysis } from "../context/AnalysisContext";

export default function Page () {

    const { trackEvent } = useAnalysis();

    const handleOpenPage = async (type, elementId) => {
        await trackEvent("navigation_clicked", {
            elementType: type,
            elementId: elementId,
        })
    }

    return (
        <>
            <header className="fixed inset w-full h border-bottom zHeader bg-dark-20 blur" style={{ "--h": "100px" }}>
                <div className="w m-auto h-full flex items-center justify-between" style={{ "--w": "90%" }}>
                    <nav className="h-full flex items-center gap-md">
                        <Link href="/" className="text-3xl text-dark fw-bold">AlgLab</Link>
                        <Link href="/docs" className="text-gray" onClick={() => handleOpenPage('link', 'docs-link')}>Documentación</Link>
                    </nav>

                    <Link href="/app" className="btn btn-primary" onClick={() => handleOpenPage('link', 'app-link')}>Comenzar</Link>
                </div>
            </header>

            <main className="w-full" style={{marginTop: "100px"}}>

                <section className="py-4xl h" style={{"--h": "calc(100dvh - 100px)"}}>
                    <div className="w h-full m-auto text-center" style={{ "--w": "90%" }}>
                        <div className="mx-auto h-full flex flex-col items-center justify-center gap-md">
                            <span className="text-sm bg-dark-secondary py-sm px-md border-bottom rounded-full">Aprende algoritmos de una nueva forma</span>
                            <h1 className="text-center text-8xl fw-bold text-dark mt-md leading-tight"> Donde los algoritmos <br /> cobran vida.</h1>
                            <p className="text-xl text-gray mt-md" style={{ maxWidth: "700px", marginInline: "auto" }}>Escribe pseudocódigo, ejecútalo, visualiza cómo funciona y comprende paso a paso qué está haciendo tu programa.</p>
                            <div className="flex justify-center gap-md mt-lg">
                                <Link href="/app" className="btn btn-primary">Probar AlgLab →</Link>
                                <Link href="/docs" className="btn btn-ghos">Ver documentación</Link>
                            </div>
                            <p className="text-sm mt-md text-gray text-italic">Sin instalar nada. Directamente desde tu navegador.</p>
                        </div>
                    </div>
                </section>

                <section className="py-4xl border-top h" style={{"--h": "calc(100dvh - 100px)"}}>
                    <div className="w h-full m-auto" style={{ "--w": "90%" }} >
                        <div className="mx-auto text-center h-full flex flex-col items-center justify-center gap-md" style={{"maxWidth": "800px"}}>
                            <span className="text-sm bg-dark-secondary py-sm px-md border-bottom rounded-full leading-tight">Un entorno creado para aprender</span>
                            <h2 className="text-6xl fw-bold text-dark mt-sm">Aprende algoritmos haciendo.</h2>
                            <p className="text-lg mt-md text-gray">
                                AlgLab es un entorno educativo basado en un
                                lenguaje de pseudocódigo propio. Escribe tus
                                algoritmos y comprueba inmediatamente cómo
                                funcionan.
                            </p>
                            <div className="grid grid-cols-3 gap-lg">
                                <article className="bg-dark-secondary rounded-md p-md">
                                    <span className="text-sm">
                                        01
                                    </span>

                                    <h3 className="text-2xl fw-bold text-dark mt-sm">
                                        Escribe
                                    </h3>

                                    <p className="mt-sm">
                                        Practica pseudocódigo y desarrolla la lógica
                                        detrás de tus algoritmos.
                                    </p>
                                </article>
                                <article className="bg-dark-secondary rounded-md p-md">
                                    <span className="text-sm">
                                        02
                                    </span>

                                    <h3 className="text-2xl fw-bold text-dark mt-sm">
                                        Ejecuta
                                    </h3>

                                    <p className="mt-sm">
                                        Ejecuta tus algoritmos directamente desde el
                                        navegador y comprueba tus resultados.
                                    </p>
                                </article>
                                <article className="bg-dark-secondary rounded-md p-md">
                                    <span className="text-sm">
                                        03
                                    </span>

                                    <h3 className="text-2xl fw-bold text-dark mt-sm">
                                        Comprende
                                    </h3>

                                    <p className="mt-sm">
                                        Avanza paso a paso y observa cómo evoluciona
                                        tu algoritmo durante la ejecución.
                                    </p>
                                </article>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="h py-4xl border-top" style={{"--h": "calc(100dvh - 100px)"}}>
                    <div className="w m-auto h-full" style={{ "--w": "90%" }}>
                        <div className="mx-auto h-full flex flex-col items-center justify-center gap-md text-center" style={{ maxWidth: "900px" }} >
                            <span className="text-sm bg-dark-secondary py-sm px-md border-bottom rounded-full">Visualización</span>
                            <h2 className="text-6xl fw-bold text-dark mt-sm leading-tight">Convierte algoritmos en lógica visual.</h2>
                            <p className="text-lg mt-md text-gray">
                                Genera diagramas de flujo a partir de tus algoritmos y conecta lo que escribes con la lógica que realmente está ejecutando el programa.
                            </p>
                            <div className="w-fit mt-lg bg-dark-secondary p-md rounded-md">
                                <strong>Pseudocódigo → lógica → visualización</strong>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="h py-4xl border-top" style={{"--h": "calc(100dvh - 100px)"}}>
                    <div className="w m-auto h-full" style={{ "--w": "90%" }}>
                        <div className="mx-auto text-center h-full flex flex-col items-center justify-center gap-md" style={{ maxWidth: "900px" }}>
                            <span className="text-sm bg-dark-secondary py-sm px-md border-bottom rounded-full">Tecnología</span>
                            <h2 className="text-6xl fw-bold text-dark mt-sm leading-tight">Un motor construido desde cero.</h2>
                            <p className="text-lg mt-md">AlgLab cuenta con su propio motor para analizar, interpretar y ejecutar algoritmos.</p>
                            <div className="w-full block text-center">
                                <code className="w-fit p-md rounded-md border-bottom mt-lg bg-dark-secondary">
                                    Lexer → Parser → AST → Semantic → Runtime
                                </code>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="h py-4xl border-top" style={{"--h": "calc(100dvh - 100px)"}}>
                    <div className="w m-auto h-full text-center" style={{ "--w": "90%" }}>
                        <div className="mx-auto h-full flex flex-col items-center justify-center gap-md" style={{ maxWidth: "800px" }}>
                            <h2 className="text-6xl fw-bold text-dark  leading-tight"> Aprende hoy. <br /> Programa mañana.</h2>
                            <p className="text-lg mt-md">
                                Porque aprender a programar no debería empezar
                                memorizando sintaxis.
                                <br />
                                Debería empezar entendiendo cómo pensar.
                            </p>
                            <div className="mt-lg">
                                <Link href="/app" className="btn btn-primary">Comenzar a practicar →</Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="h py-4xl bg-secondary-dark border-top" style={{"--h": "calc(100dvh - 100px)"}}>
                    <div className="w m-auto text-center h-full flex flex-col items-center justify-center gap-md" style={{ "--w": "90%" }}>
                        <h2 className="text-6xl fw-bold text-dark leading-tight text-gradient-capra">Escribe tu primer <br/>algoritmo.</h2>
                        <p className="text-lg mt-md">No necesitas instalar nada. Solo abre AlgLab y empieza a experimentar.</p>
                        <div className="mt-lg">
                            <Link href="/app" className="btn btn-ghos">Probar AlgLab →</Link>
                        </div>
                    </div>
                </section>

            </main>

            <footer className="border-top bg-dark-secondary py-2xl">
                <div className="w m-auto flex items-center justify-between" style={{ "--w": "90%" }} >
                    <div>
                        <strong className="text-4xl">AlgLab</strong>
                        <p className="text-sm mt-sm text-gray">Donde aprender algoritmos se convierte en programar.</p>
                    </div>
                    <div className="flex gap-md">
                        <Link href="/docs" className="text-gray" onClick={() => handleOpenPage('link', 'docs-link')}>Documentación</Link>
                        <Link href="https://github.com/ArcanaCorp/lab" className="text-gray" target="_blank" onClick={() => handleOpenPage('link', 'github-link')}>GitHub</Link>
                    </div>
                </div>
            </footer>
        </>
    );
}