'use client';

import { useRef } from "react";
import { highlightCode } from "./SyntaxHighlight";

export default function PseudocodeEditor({
    value,
    onChange,
    executionState
}) {

    const highlightRef = useRef(null);

    function handleScroll(event) {
        const textarea = event.currentTarget;

        if (highlightRef.current) {
            highlightRef.current.scrollTop = textarea.scrollTop;
            highlightRef.current.scrollLeft = textarea.scrollLeft;
        }
    }

    return (
        <div
            className="w-full h-full rounded-md border border-solid border-gray-100"
            style={{
                overflow: "hidden",
                position: "relative"
            }}
            aria-label="Pseudocódigo"
        >

            <pre
                ref={highlightRef}
                aria-hidden="true"
                className="syntax-highlight w-full h-full p-md"
                dangerouslySetInnerHTML={{
                    __html: highlightCode(value)
                }}
            />

            <textarea
                value={value}
                onChange={(event) => {
                    onChange(event.target.value);
                }}
                onScroll={handleScroll}
                className="syntax-input w-full h-full resize-none p-md"
                spellCheck={false}
            />

        </div>
    );
}