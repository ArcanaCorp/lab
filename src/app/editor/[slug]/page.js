'use client';
import { useEffect, useState } from "react";
import { getAlgorithmBySlug } from "../../../lib/algorithms";
import HeaderEditor from "../../../components/HeaderEditor";
import EditorWorkspace from "../../../components/editor/EditorWorkspace";

export default function EditorPage({ params }) {

    const [algorithm, setAlgorithm] = useState(null);

    useEffect(() => {
        async function load() {
            const { slug } = await params;
            const data = getAlgorithmBySlug(slug);
            setAlgorithm(data);
        }

        load();
    }, [params]);

    if (!algorithm) {
        return <div>Algoritmo no encontrado.</div>;
    }

    return (
        <>
            <HeaderEditor params={params} algorithm={algorithm} />
            <EditorWorkspace algorithm={algorithm} />
        </>
    );
}