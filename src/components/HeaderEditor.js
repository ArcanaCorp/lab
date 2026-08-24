import { IconChevronLeft, IconDeviceFloppy, IconPlayerPause, IconPlayerPlay, IconReload, IconSettings } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { updateAlgorithm } from "../lib/algorithms";
import { useRouter } from "next/navigation";

export default function HeaderEditor ({ algorithm, onRun }) {

    const router = useRouter();

    const [editingTitle, setEditingTitle] = useState(false);
    const [title, setTitle] = useState("");
    
    const inputRef = useRef(null);
    
    function startEditingTitle() {
        setTitle(algorithm.title || "");
        setEditingTitle(true);
    }
    
    function saveTitle() {
        const newTitle = title.trim();
    
        const updated = updateAlgorithm(
            algorithm.slug,
            {
                title: newTitle
            }
        );
    
        if (updated) {
            setTitle(updated.title);
        }
    
        setEditingTitle(false);
    }
    
    function handleTitleKeyDown(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            saveTitle();
        }
    
        if (event.key === "Escape") {
            setTitle(algorithm.title || "");
            setEditingTitle(false);
        }
    }

    return (
        <header className="w-full h bg-white border-b" style={{"--h": "60px"}}>
            <div className="w m-auto h-full flex items-center justify-between" style={{"--w": "90%"}}>
                <div className="flex items-center gap-sm">
                    <button className="square center rounded-sm bg-gray-100" style={{"--square": "40px"}} onClick={() => router.back()}><IconChevronLeft/></button>
                    {editingTitle ? (
                        <input ref={inputRef} type="text" value={title} onChange={(event) => setTitle(event.target.value)} onBlur={saveTitle} onKeyDown={handleTitleKeyDown} placeholder="Sin título" className="border border-solid border-gray px-sm"/>
                    ) : (
                        <h1 onClick={startEditingTitle} className="text-lg fw-semibold pointer" title="Haz clic para editar" > {algorithm.title || "Sin título"}</h1>
                    )}
                    <p className="bg-mariner-50 text-xs p-sm rounded-sm">Guardado localmente</p>
                </div>
                <div className="flex items-center gap-md">
                    <button>Docs</button>
                    <button>Pseudocódigo</button>
                    <button>Diagrama</button>
                    <button>Código</button>
                </div>
                <div className="flex items-center gap-sm">
                    <button className="square center rounded-sm bg-gray-100" style={{"--square": "40px"}}><IconReload/></button>
                    <button className="square center rounded-sm bg-gray-100" style={{"--square": "40px"}}><IconDeviceFloppy/></button>
                    <button className="square center rounded-sm bg-gray-100" style={{"--square": "40px"}}><IconSettings/></button>
                    <button className="h px-md bg-gray-100 rounded-sm flex items-center gap-sm" style={{"--h": "40px"}}><IconPlayerPause/> Pausar</button>
                    <button className="h px-md bg-primary rounded-sm text-white flex items-center gap-sm" style={{"--h": "40px"}} onClick={onRun}>
                        <IconPlayerPlay/> Run
                    </button>
                </div>
            </div>
        </header>
    )
}
