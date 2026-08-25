"use client";
import NewAlgorithmButton from "../components/NewAlgorithmButton";
import { IconBell, IconSettings } from "@tabler/icons-react";
import Link from "next/link";
import { getAlgorithms } from "../lib/algorithms";
import { useEffect, useState } from "react";

export default function Page () {

    const [algorithms, setAlgorithms] = useState([]);

    useEffect(() => {
        function loadAlgorithms() {
            setAlgorithms(getAlgorithms());
        }

        // Primera carga
        loadAlgorithms();

        // Cuando se cree/modifique un algoritmo
        window.addEventListener(
            "algorithms-updated",
            loadAlgorithms
        );

        return () => {
            window.removeEventListener(
                "algorithms-updated",
                loadAlgorithms
            );
        };
    }, []);

    return (
        <>
            <header className="w-full h bg-white" style={{"--h": "60px"}}>
                <div className="w m-auto h-full flex items-center justify-between" style={{"--w": "90%"}}>
                    <nav className="h-full flex items-center gap-md">
                        <Link href={'/'} className="text-3xl text-dark fw-bold">AlgLab</Link>
                        <Link href={'/documentation'} className="text-dark">Documentation</Link>
                    </nav>
                    <div className="h-full flex items-center gap-md">
                        <NewAlgorithmButton/>
                    </div>
                </div>
            </header>
            <main className="w-full py-2xl">
                <div className="w m-auto flex flex-col gap-xl" style={{"--w": "90%"}}>
                    <div className="w-full flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl">Mis Algoritmos</h1>
                            <p className="text-gray">Gestiona, organiza y accede a todos tus proyectos de lógica de programación guardados localmente.</p>
                        </div>
                        <NewAlgorithmButton/>
                    </div>
                    <div className="w-full grid grid-cols-4 gap-md">
                        <NewAlgorithmButton>Crear nuevo algoritmo</NewAlgorithmButton>
                        {algorithms.map((algorithm) => (
                            <Link key={algorithm.slug} href={`/editor/${algorithm.slug}`} className="bg-white p-lg border border-gray-200 rounded-md">
                                <div className="flex flex-col gap-sm">
                                    <h3 className="text-lg fw-semibold">{algorithm.title || "Sin título"}</h3>
                                    <span className="text-sm text-gray">{algorithm.slug}</span>
                                    <span className="text-sm text-gray">{new Date(algorithm.created).toLocaleString("es-PE")}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </>
    )
}