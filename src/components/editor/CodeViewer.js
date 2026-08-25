"use client";

import { useMemo, useState } from "react";
import {
    generateCode
} from "@lab/algorithm-engine";

const languages = [
    {
        id: "javascript",
        label: "JavaScript"
    },
    {
        id: "python",
        label: "Python"
    },
    {
        id: "php",
        label: "PHP"
    },
    {
        id: "java",
        label: "Java"
    }
];

export default function CodeViewer({ program }) {

    const [language, setLanguage] = useState("javascript");
    const [open, setOpen] = useState(false);

    const generated = useMemo(() => {

        if (!program) {
            return null;
        }

        return generateCode(
            program,
            language
        );

    }, [program, language]);


    if (!program) {
        return (
            <div className="w-full h-full center">
                <p>No hay código disponible.</p>
            </div>
        );
    }


    return (
        <div className="relative w-full h-full">

            {/* Selector */}

            <div className="absolute" style={{top: "10px", right: "100px"}}>

                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="bg-white border border-solid border-gray rounded-sm px-md py-sm shadow-sm"
                >
                    {languages.find(
                        item => item.id === language
                    )?.label}

                    <span className="ml-sm">
                        ▾
                    </span>
                </button>


                {open && (
                    <div className="absolute mt-sm bg-white border border-solid border-gray rounded-sm shadow-md min-w-full" style={{top: "30px", right: "0"}}>

                        {languages.map(item => (

                            <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                    setLanguage(item.id);
                                    setOpen(false);
                                }}
                                className="block w-full text-left px-md py-sm hover:bg-gray-100"
                            >
                                {item.label}
                            </button>

                        ))}

                    </div>
                )}

            </div>


            {/* Código */}

            <div className="w-full h-full overflow-auto bg-white p-lg">

                <pre className="text-sm">
                    <code>
                        {generated?.code}
                    </code>
                </pre>

            </div>

        </div>
    );
}