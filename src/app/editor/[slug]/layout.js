import { EditorProvider } from "../../../context/EditorContext";
import { getAlgorithmBySlug } from "../../../lib/algorithms";

export async function generateMetadata({ params }) {

    const { slug } = await params;

    if (!slug) {
        return {
            title: "Editor | AlgLab",
            description: "Edita y ejecuta algoritmos en AlgLab.",
        };
    }

    const algorithm = await getAlgorithmBySlug(slug);

    if (!algorithm) {
        return {
            title: "Editor | AlgLab",
            description: "El algoritmo solicitado no existe en AlgLab.",
        };
    }

    return {
        title: `${algorithm.title} | Editor`,
        description: `Edita y ejecuta el algoritmo "${algorithm.title}" en AlgLab.`,
    };
}

export default async function EditorLayout ({ children, params }) {
    
    const { slug } = await params;

    return (
        <EditorProvider slug={slug}>
            {children}
        </EditorProvider>
    );
}