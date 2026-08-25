"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

import {
    generateCode
} from "@lab/algorithm-engine";

const languages = [
    {
        id: "javascript",
        label: "JavaScript",
        hljs: "javascript"
    },
    {
        id: "python",
        label: "Python",
        hljs: "python"
    },
    {
        id: "php",
        label: "PHP",
        hljs: "php"
    },
    {
        id: "java",
        label: "Java",
        hljs: "java"
    }
];

export default function CodeViewer({ program }) {

    const [language, setLanguage] = useState("javascript");
    const [open, setOpen] = useState(false);

    const codeRef = useRef(null);

    const generated = useMemo(() => {

        if (!program) {
            return null;
        }

        return generateCode(
            program,
            language
        );

    }, [program, language]);


    useEffect(() => {

        if (!codeRef.current || !generated?.code) {
            return;
        }

        const selectedLanguage = languages.find(
            item => item.id === language
        );

        if (!selectedLanguage) {
            return;
        }

        const result = hljs.highlight(
            generated.code,
            {
                language: selectedLanguage.hljs
            }
        );

        codeRef.current.innerHTML = result.value;

    }, [generated, language]);


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

            <div
                className="absolute z-10"
                style={{
                    top: "10px",
                    right: "100px"
                }}
            >

                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="bg-white border border-solid border-gray rounded-sm px-md py-sm shadow-sm"
                >

                    {
                        languages.find(
                            item => item.id === language
                        )?.label
                    }

                    <span className="ml-sm">
                        ▾
                    </span>

                </button>


                {open && (
                    <div
                        className="absolute mt-sm bg-white border border-solid border-gray rounded-sm shadow-md min-w-full"
                        style={{
                            top: "30px",
                            right: "0"
                        }}
                    >

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
                    <code
                        ref={codeRef}
                        className={`language-${language}`}
                    />
                </pre>

            </div>

        </div>
    );
}