"use client";

import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";

const sections = [
    {
        id: "inicio",
        title: "Primeros pasos",
        items: [
            ["introduccion", "Introducción"],
            ["primer-algoritmo", "Tu primer algoritmo"],
            ["estructura", "Estructura básica"],
        ],
    },
    {
        id: "variables",
        title: "Fundamentos",
        items: [
            ["variables", "Variables"],
            ["tipos-datos", "Tipos de datos"],
            ["asignacion", "Asignación"],
            ["entrada-salida", "Entrada y salida"],
        ],
    },
    {
        id: "operadores",
        title: "Operadores",
        items: [
            ["aritmeticos", "Aritméticos"],
            ["relacionales", "Relacionales"],
            ["logicos", "Lógicos"],
        ],
    },
    {
        id: "control",
        title: "Control de flujo",
        items: [
            ["si", "Condicional Si"],
            ["mientras", "Mientras"],
            ["para", "Para"],
        ],
    },
    {
        id: "referencia",
        title: "Referencia",
        items: [
            ["reservadas", "Palabras reservadas"],
            ["errores", "Errores frecuentes"],
            ["ejemplo-completo", "Ejemplo completo"],
        ],
    },
];

function CodeBlock({ children }) {
    return (
        <pre className="bg-gray-700 text-white p-lg rounded-md overflow-auto text-sm leading-relaxed">
            <code>{children}</code>
        </pre>
    );
}

function Section({ id, title, children }) {
    return (
        <section id={id} className="mb-xl scroll-mt-lg">
            <h2 className="text-2xl fw-semibold mb-md">
                {title}
            </h2>

            <div className="text-gray-700 leading-relaxed">
                {children}
            </div>
        </section>
    );
}

export default function DocsPage() {

    const [search, setSearch] = useState("");

    const filteredSections = sections
        .map(section => ({
            ...section,
            items: section.items.filter(item =>
                item[1]
                    .toLowerCase()
                    .includes(search.toLowerCase())
            ),
        }))
        .filter(section => section.items.length > 0);

    return (
        <div className="min-h-screen bg-gray-50">

            {/* HEADER */}

            <header className="sticky top-0 z-50 bg-white border-b">

                <div
                    className="w m-auto flex items-center justify-between h"
                    style={{
                        "--w": "90%",
                        "--h": "64px"
                    }}
                >

                    <div className="flex items-center gap-md">

                        <div className="fw-bold text-lg">
                            AlgLab
                        </div>

                        <span className="text-gray-400">
                            /
                        </span>

                        <span className="text-gray-600">
                            Documentación
                        </span>

                    </div>

                    <div
                        className="flex items-center gap-sm bg-gray-100 rounded-md px-md"
                        style={{
                            width: "280px",
                            height: "38px"
                        }}
                    >

                        <span className="text-gray-400">
                            <IconSearch/>
                        </span>

                        <input
                            type="search"
                            value={search}
                            onChange={event =>
                                setSearch(event.target.value)
                            }
                            placeholder="Buscar documentación..."
                            className="bg-transparent outline-none w-full"
                        />

                    </div>

                </div>

            </header>


            {/* LAYOUT */}

            <div
                className="w m-auto flex"
                style={{
                    "--w": "90%",
                    minHeight: "calc(100vh - 64px)"
                }}
            >

                {/* SIDEBAR */}

                <aside
                    className="hidden md:block sticky"
                    style={{
                        top: "64px",
                        width: "240px",
                        height: "calc(100vh - 64px)",
                        overflowY: "auto",
                        paddingTop: "32px",
                        paddingRight: "24px"
                    }}
                >

                    <p className="text-xs fw-semibold text-gray-400 uppercase mb-md">
                        Contenido
                    </p>

                    {filteredSections.map(section => (

                        <div key={section.id} className="mb-lg">

                            <p className="text-sm fw-semibold mb-sm">
                                {section.title}
                            </p>

                            <nav className="flex flex-col gap-xs">

                                {section.items.map(([id, label]) => (

                                    <a
                                        key={id}
                                        href={`#${id}`}
                                        className="text-sm text-gray-500 hover:text-black py-xs"
                                    >
                                        {label}
                                    </a>

                                ))}

                            </nav>

                        </div>

                    ))}

                </aside>


                {/* CONTENT */}

                <main
                    className="flex-1"
                    style={{
                        maxWidth: "850px",
                        padding: "48px 0 100px"
                    }}
                >

                    {/* HERO */}

                    <div className="mb-xl">

                        <p className="text-sm text-gray-500 mb-sm">
                            DOCUMENTACIÓN
                        </p>

                        <h1 className="text-4xl fw-bold mb-md">
                            Aprende pseudocódigo con AlgLab
                        </h1>

                        <p className="text-lg text-gray-600 leading-relaxed">
                            Aprende a crear algoritmos utilizando
                            pseudocódigo de una forma sencilla,
                            visual y práctica.
                        </p>

                    </div>


                    {/* INTRODUCCION */}

                    <Section
                        id="introduccion"
                        title="Introducción"
                    >

                        <p className="mb-md">
                            AlgLab es un entorno de aprendizaje para
                            algoritmos y programación. Permite escribir
                            pseudocódigo, ejecutarlo, visualizar su
                            flujo y posteriormente convertirlo a
                            diferentes lenguajes de programación.
                        </p>

                        <p className="mb-md">
                            La sintaxis utilizada está pensada para
                            ser fácil de leer y comprender incluso si
                            estás comenzando a programar.
                        </p>

                        <div className="bg-blue-50 border border-blue-200 p-md rounded-md">
                            <strong>Consejo:</strong>{" "}
                            comienza escribiendo algoritmos pequeños.
                            Primero aprende variables, entrada y salida;
                            después incorpora condiciones y ciclos.
                        </div>

                    </Section>


                    {/* PRIMER ALGORITMO */}

                    <Section
                        id="primer-algoritmo"
                        title="Tu primer algoritmo"
                    >

                        <p className="mb-md">
                            El siguiente programa muestra un mensaje
                            en pantalla:
                        </p>

                        <CodeBlock>{`Algoritmo HolaMundo

    Escribir "Hola mundo"

FinAlgoritmo`}</CodeBlock>

                        <p className="mt-md">
                            Todo algoritmo comienza con{" "}
                            <code>Algoritmo</code> y termina con{" "}
                            <code>FinAlgoritmo</code>.
                        </p>

                    </Section>


                    {/* ESTRUCTURA */}

                    <Section
                        id="estructura"
                        title="Estructura básica"
                    >

                        <CodeBlock>{`Algoritmo NombreDelAlgoritmo

    // Instrucciones

FinAlgoritmo`}</CodeBlock>

                        <div className="mt-md">

                            <ul className="list-disc pl-lg space-y-sm">

                                <li>
                                    <strong>Algoritmo</strong> define
                                    el inicio del programa.
                                </li>

                                <li>
                                    El nombre identifica al algoritmo.
                                </li>

                                <li>
                                    Las instrucciones se escriben
                                    dentro del algoritmo.
                                </li>

                                <li>
                                    <strong>FinAlgoritmo</strong>
                                    indica el final.
                                </li>

                            </ul>

                        </div>

                    </Section>


                    {/* VARIABLES */}

                    <Section
                        id="variables"
                        title="Variables"
                    >

                        <p className="mb-md">
                            Las variables almacenan información que
                            puede utilizar el algoritmo.
                        </p>

                        <CodeBlock>{`Definir edad Como Entero
Definir nombre Como Caracter
Definir precio Como Real
Definir activo Como Logico`}</CodeBlock>

                        <p className="mt-md">
                            La sintaxis general es:
                        </p>

                        <CodeBlock>{`Definir nombre Como Tipo`}</CodeBlock>

                    </Section>


                    {/* TIPOS */}

                    <Section
                        id="tipos-datos"
                        title="Tipos de datos"
                    >

                        <div className="overflow-auto">

                            <table className="w-full border-collapse">

                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-sm">
                                            Tipo
                                        </th>

                                        <th className="text-left p-sm">
                                            Descripción
                                        </th>

                                        <th className="text-left p-sm">
                                            Ejemplo
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>

                                    <tr className="border-b">
                                        <td className="p-sm">
                                            Entero
                                        </td>
                                        <td className="p-sm">
                                            Números sin decimales
                                        </td>
                                        <td className="p-sm">
                                            25
                                        </td>
                                    </tr>

                                    <tr className="border-b">
                                        <td className="p-sm">
                                            Real
                                        </td>
                                        <td className="p-sm">
                                            Números decimales
                                        </td>
                                        <td className="p-sm">
                                            19.5
                                        </td>
                                    </tr>

                                    <tr className="border-b">
                                        <td className="p-sm">
                                            Caracter
                                        </td>
                                        <td className="p-sm">
                                            Texto
                                        </td>
                                        <td className="p-sm">
                                            "Carlos"
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="p-sm">
                                            Logico
                                        </td>
                                        <td className="p-sm">
                                            Verdadero o Falso
                                        </td>
                                        <td className="p-sm">
                                            Verdadero
                                        </td>
                                    </tr>

                                </tbody>

                            </table>

                        </div>

                    </Section>


                    {/* ASIGNACION */}

                    <Section
                        id="asignacion"
                        title="Asignación"
                    >

                        <p className="mb-md">
                            Puedes almacenar un valor utilizando
                            el operador de asignación.
                        </p>

                        <CodeBlock>{`Definir edad Como Entero

edad <- 20

Escribir edad`}</CodeBlock>

                        <p className="mt-md">
                            También puedes utilizar expresiones:
                        </p>

                        <CodeBlock>{`Definir a Como Entero
Definir b Como Entero
Definir resultado Como Entero

a <- 10
b <- 5

resultado <- a + b`}</CodeBlock>

                    </Section>


                    {/* ENTRADA Y SALIDA */}

                    <Section
                        id="entrada-salida"
                        title="Entrada y salida"
                    >

                        <h3 className="text-lg fw-semibold mb-sm">
                            Escribir
                        </h3>

                        <p className="mb-md">
                            Muestra información en la terminal.
                        </p>

                        <CodeBlock>{`Escribir "Hola"
Escribir 25
Escribir nombre`}</CodeBlock>

                        <h3 className="text-lg fw-semibold mt-lg mb-sm">
                            Leer
                        </h3>

                        <p className="mb-md">
                            Solicita información al usuario.
                        </p>

                        <CodeBlock>{`Definir nombre Como Caracter

Escribir "¿Cuál es tu nombre?"
Leer nombre

Escribir nombre`}</CodeBlock>

                    </Section>


                    {/* ARITMETICOS */}

                    <Section
                        id="aritmeticos"
                        title="Operadores aritméticos"
                    >

                        <div className="overflow-auto">

                            <table className="w-full bg-gray-700 text-white border-collapse">

                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-sm">
                                            Operador
                                        </th>
                                        <th className="text-left p-sm">
                                            Operación
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>

                                    <tr className="border-b">
                                        <td className="p-sm">+</td>
                                        <td className="p-sm">
                                            Suma
                                        </td>
                                    </tr>

                                    <tr className="border-b">
                                        <td className="p-sm">-</td>
                                        <td className="p-sm">
                                            Resta
                                        </td>
                                    </tr>

                                    <tr className="border-b">
                                        <td className="p-sm">*</td>
                                        <td className="p-sm">
                                            Multiplicación
                                        </td>
                                    </tr>

                                    <tr className="border-b">
                                        <td className="p-sm">/</td>
                                        <td className="p-sm">
                                            División
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="p-sm">%</td>
                                        <td className="p-sm">
                                            Módulo
                                        </td>
                                    </tr>

                                </tbody>

                            </table>

                        </div>

                    </Section>


                    {/* RELACIONALES */}

                    <Section
                        id="relacionales"
                        title="Operadores relacionales"
                    >

                        <CodeBlock>{`>
>=
<
<=
=
<>`}</CodeBlock>

                        <p className="mt-md">
                            Estos operadores producen un valor lógico.
                        </p>

                        <CodeBlock>{`edad >= 18
precio < 100
nombre = "Carlos"`}</CodeBlock>

                    </Section>


                    {/* LOGICOS */}

                    <Section
                        id="logicos"
                        title="Operadores lógicos"
                    >

                        <CodeBlock>{`Y
O
NO`}</CodeBlock>

                        <CodeBlock>{`edad >= 18 Y edad <= 60

edad = 18 O edad = 19

NO activo`}</CodeBlock>

                    </Section>


                    {/* SI */}

                    <Section
                        id="si"
                        title="Condicional Si"
                    >

                        <p className="mb-md">
                            Permite ejecutar diferentes instrucciones
                            dependiendo de una condición.
                        </p>

                        <CodeBlock>{`Si edad >= 18 Entonces

    Escribir "Mayor de edad"

Sino

    Escribir "Menor de edad"

FinSi`}</CodeBlock>

                        <p className="mt-md">
                            La sección <code>Sino</code> es opcional.
                        </p>

                        <CodeBlock>{`Si edad >= 18 Entonces
    Escribir "Mayor"
FinSi`}</CodeBlock>

                    </Section>


                    {/* MIENTRAS */}

                    <Section
                        id="mientras"
                        title="Ciclo Mientras"
                    >

                        <p className="mb-md">
                            Ejecuta un bloque mientras una condición
                            sea verdadera.
                        </p>

                        <CodeBlock>{`Definir contador Como Entero

contador <- 1

Mientras contador <= 5 Hacer

    Escribir contador

    contador <- contador + 1

FinMientras`}</CodeBlock>

                    </Section>


                    {/* PARA */}

                    <Section
                        id="para"
                        title="Ciclo Para"
                    >

                        <p className="mb-md">
                            El ciclo Para es útil cuando conocemos
                            el rango de repetición.
                        </p>

                        <CodeBlock>{`Para i <- 1 Hasta 10 Con Paso 1 Hacer

    Escribir i

FinPara`}</CodeBlock>

                        <p className="mt-md">
                            También puedes utilizar pasos negativos:
                        </p>

                        <CodeBlock>{`Para i <- 10 Hasta 1 Con Paso -1 Hacer

    Escribir i

FinPara`}</CodeBlock>

                    </Section>


                    {/* PALABRAS RESERVADAS */}

                    <Section
                        id="reservadas"
                        title="Palabras reservadas"
                    >

                        <p className="mb-md">
                            Estas palabras tienen un significado
                            especial dentro del lenguaje.
                        </p>

                        <div className="flex flex-wrap gap-sm">

                            {[
                                "Algoritmo",
                                "FinAlgoritmo",
                                "Definir",
                                "Como",
                                "Entero",
                                "Real",
                                "Caracter",
                                "Logico",
                                "Leer",
                                "Escribir",
                                "Si",
                                "Entonces",
                                "Sino",
                                "FinSi",
                                "Mientras",
                                "Hacer",
                                "FinMientras",
                                "Para",
                                "Hasta",
                                "Con",
                                "Paso",
                                "FinPara",
                                "Y",
                                "O",
                                "NO"
                            ].map(word => (

                                <code
                                    key={word}
                                    className="bg-gray-100 px-sm py-xs rounded-sm"
                                >
                                    {word}
                                </code>

                            ))}

                        </div>

                    </Section>


                    {/* ERRORES */}

                    <Section
                        id="errores"
                        title="Errores frecuentes"
                    >

                        <h3 className="text-lg fw-semibold mb-sm">
                            Variable no declarada
                        </h3>

                        <CodeBlock>{`edad <- 20`}</CodeBlock>

                        <p className="mt-sm mb-lg">
                            Antes de utilizar una variable debes
                            declararla.
                        </p>

                        <CodeBlock>{`Definir edad Como Entero
edad <- 20`}</CodeBlock>


                        <h3 className="text-lg fw-semibold mt-lg mb-sm">
                            División entre cero
                        </h3>

                        <CodeBlock>{`resultado <- 10 / 0`}</CodeBlock>

                        <p className="mt-sm">
                            No es posible dividir entre cero.
                        </p>


                        <h3 className="text-lg fw-semibold mt-lg mb-sm">
                            Ciclo infinito
                        </h3>

                        <CodeBlock>{`contador <- 1

Mientras contador <= 10 Hacer

    Escribir contador

FinMientras`}</CodeBlock>

                        <p className="mt-sm">
                            La condición nunca cambia porque
                            <code>contador</code> no se incrementa.
                        </p>

                    </Section>


                    {/* EJEMPLO COMPLETO */}

                    <Section
                        id="ejemplo-completo"
                        title="Ejemplo completo"
                    >

                        <p className="mb-md">
                            El siguiente algoritmo solicita la edad
                            de una persona y determina si es mayor
                            o menor de edad.
                        </p>

                        <CodeBlock>{`Algoritmo Edad

    Definir edad Como Entero

    Escribir "¿Cuál es tu edad?"
    Leer edad

    Si edad >= 18 Entonces

        Escribir "Eres mayor de edad"

    Sino

        Escribir "Eres menor de edad"

    FinSi

FinAlgoritmo`}</CodeBlock>

                        <div className="bg-green-50 border border-green-200 p-md rounded-md mt-lg">

                            <strong>¿Qué aprendiste?</strong>

                            <ul className="list-disc pl-lg mt-sm">

                                <li>Declarar una variable.</li>
                                <li>Solicitar información.</li>
                                <li>Mostrar información.</li>
                                <li>Comparar valores.</li>
                                <li>Utilizar una condición.</li>

                            </ul>

                        </div>

                    </Section>


                    {/* FOOTER */}

                    <div className="border-t pt-lg mt-xl text-sm text-gray-500">

                        <p>
                            AlgLab · Documentación del lenguaje
                        </p>

                        <p className="mt-xs">
                            Aprende algoritmos. Visualiza el flujo.
                            Programa.
                        </p>

                    </div>

                </main>

            </div>

        </div>
    );
}