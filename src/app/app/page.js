'use client';

import { IconPlus, IconShare3 } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createAlgorithm, getAlgorithms, deleteAlgorithm } from "../../lib/algorithms";
import { usePathname, useRouter } from "next/navigation";
import AlgorithmCard from "../../components/AlgorithmCard";
import { useAnalysis } from "../../context/AnalysisContext";
import { toast } from "sonner";

export default function Page () {

    const router = useRouter();
    const pathname = usePathname();

    const { createShareLink, trackEvent } = useAnalysis();
    const [algorithms, setAlgorithms] = useState([]);
    
    useEffect(() => {

        function loadAlgorithms() {
            setAlgorithms(getAlgorithms());
        }
    
        loadAlgorithms();
    
        window.addEventListener("algorithms-updated", loadAlgorithms);
    
        return () => {
            window.removeEventListener("algorithms-updated", loadAlgorithms);
        };

    }, []);

    const handleCreate = async () => {
        const algorithm = createAlgorithm();
        await trackEvent("algorithm_created", {
            elementType: "button",
            elementId: "create-algorithm",
            elementText: "Nuevo Proyecto",
            metadata: {
                projectId: algorithm.slug,
                resourceType: "algorithm",
                resourceId: algorithm.slug,
                sourcePath: pathname,
            },
        });
        router.push(`/editor/${algorithm.slug}`);
    }

    const handleDelete =  async (slug, alg) => {
        deleteAlgorithm(slug);
        setAlgorithms((current) => current.filter((algorithm) => algorithm.slug !== slug));
        await trackEvent("algorithm_deleted", {
            elementType: "button",
            elementId: "delete-algorithm",
            elementText: "Eliminar algoritmo",
            metadata: {
                algorithmId: alg.id,
            },
        });
    };

    const handleShare = async () => {
        try {
            const result = await createShareLink({resourceType: "page", resourceId: pathname});
            if (!result?.url || !result?.share) return;
            await navigator.clipboard.writeText(result.url);
            trackEvent("share_copied", {
                elementType: "button",
                elementId: "share-button",
                metadata: {
                    shareId:result.share.id,
                    shortCode:result.share.short_code,
                    resourceType: "page",
                    resourceId: pathname,
                },
            });
            toast.success('Enlace copiado correctamente.')
        } catch (error) {
            console.error("Error compartiendo página:", error);
            toast.error('Error', { description: 'Hubo un error al compartir. Inténtalo de nuevo.' })
        }
    };

    return (
        <>
            <header className="fixed inset w-full h border-bottom zHeader bg-dark-20 blur" style={{ "--h": "100px" }}>
                <div className="w m-auto h-full flex items-center justify-between" style={{ "--w": "90%" }}>
                    <div className="flex items-center gap-sm">
                        <Link href={'/app'} className="text-3xl text-white fw-bold">AlgLab</Link>
                        <span className="text-sm bg-dark-secondary py-sm px-md border-bottom rounded-full">Preview</span>
                    </div>
                    <div>
                        <button className="btn btn-ghos border-bottom bg-dark-secondary text-white" onClick={() => handleShare()}><IconShare3/> Compartir</button>
                    </div>
                </div>
            </header>
            <main className="w-full" style={{marginTop: "100px"}}>
                <section className="py-4xl">
                    <div className="w m-auto" style={{ "--w": "90%" }}>
                        <div className="mb-lg text-center">
                            <h1 className="text-6xl text-gradient-capra leading-tight">Estamos evolucionando<br/>para aprender</h1>
                            <p className="text-gray mt-md">Estamos lanzando para ofrecer más formas de aprender y desarrollar.</p>
                        </div>
                        <div className="w-full grid grid-cols-4 gap-md py-lg">
                            {algorithms.length > 0 ? (
                                <>
                                    <article className="bg-dark-secondary flex flex-col gap-sm p-md text-center rounded-md border-bottom pointer" onClick={handleCreate}>
                                        <span className="center square rounded-full m-auto" style={{"--square": "60px"}}><IconPlus size={32}/></span>
                                        <h3>Nuevo proyecto</h3>
                                    </article>
                                    {algorithms.map((alg) => (
                                        <AlgorithmCard key={alg.slug} alg={alg} onDelete={handleDelete} />
                                    ))}
                                </>
                            ) : (
                                <article className="bg-dark-secondary flex flex-col gap-sm p-md text-center rounded-md border-bottom pointer" onClick={handleCreate}>
                                    <span className="center square rounded-full m-auto" style={{"--square": "60px"}}><IconPlus size={32}/></span>
                                    <h3>Nuevo proyecto</h3>
                                </article>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}