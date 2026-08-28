import { EditorProvider } from "../../context/EditorContext";

export const metadata = {
    title: 'Editor | AlgLab'
}

export default async function EditorLayout ({ children, params }) {
    
    const { slug } = await params;

    return (
        <EditorProvider slug={slug}>
            {children}
        </EditorProvider>
    );
}