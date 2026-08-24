"use client";

import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { createAlgorithm } from "../lib/algorithms";

export default function NewAlgorithmButton({ children = "Nuevo Algoritmo" }) {
    const router = useRouter();

    function handleCreate() {
        const algorithm = createAlgorithm();

        router.push(`/editor/${algorithm.slug}`);
    }

    return (
        <button type="button" onClick={handleCreate} className="bg-primary text-white flex items-center gap-sm p-md rounded-sm">
            <IconPlus />
            {children}
        </button>
    );
}