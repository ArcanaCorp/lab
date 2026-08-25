import { EditorProvider } from "../../context/EditorContext";

export const metadata = {
    title: 'Editor | AlgLab'
}

export default async function EditorLayout ({ children, params }) {
    
    const { slug } = await params;

    console.log("EditorLayout slug:", slug);

    return (
        <EditorProvider slug={slug}>
            {children}
        </EditorProvider>
    );
}