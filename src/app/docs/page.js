"use client";

import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { sections } from "../../lib/docs";
import FragmentCode from "../../components/FragmentCode";
import { KEYWORDS } from "../../helper/code.helper";
import Link from "next/link";

function Section({ id, title, children }) {
    return (
        <section id={id} className="mb-xl scroll-mt-lg">
            <h2 className="text-2xl fw-semibold mb-md">{title}</h2>
            <div className="text-gray-700 leading-relaxed">{children}</div>
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
        <div className="min-h-screen bg-dark">

            <header className="sticky top-0 z-50 bg-dark border-bottom">

                <div className="w m-auto flex items-center justify-between h" style={{"--w": "90%","--h": "64px"}} >

                    <div className="flex items-center gap-md">
                        <div><Link href={'/'} className="fw-bold text-lg text-white">AlgLab</Link></div>
                        <span className="text-gray">/</span>
                        <span className="text-gray">Documentación</span>
                    </div>

                    <div className="flex items-center gap-sm bg-dark-secondary text-white rounded-md px-md" style={{width: "280px",height: "38px"}}>
                        <span className="center h-full text-gray"><IconSearch size={18} /></span>
                        <input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar documentación..." className="bg-transparent text-white outline-none w-full" />
                    </div>

                </div>

            </header>

            <div className="w m-auto flex" style={{"--w": "90%", minHeight: "calc(100vh - 64px)"}}>

                <aside className="hidden md:block sticky overflow-scroll py-2xl" style={{ top: "64px", width: "240px", height: "calc(100vh - 64px)", overflowY: "auto"}} >

                    <h3 className="text-xs fw-semibold text-gray uppercase mb-md">Contenido</h3>
                    {filteredSections.map(section => (
                        <div key={section.id} className="mb-lg">
                            <p className="text-sm fw-semibold mb-sm">{section.title}</p>
                            <nav className="flex flex-col gap-xs">
                                {section.items.map(([id, label]) => (
                                    <a key={id} href={`#${id}`} className="text-sm text-gray-800 hover:text-gray py-xs">{label}</a>
                                ))}
                            </nav>
                        </div>
                    ))}

                </aside>

                <main className="flex-1 px-lg py-2xl" style={{ maxWidth: "850px"}}>

                    <div className="mb-xl">
                        <p className="text-sm text-gray mb-sm">DOCUMENTACIÓN</p>
                        <h1 className="text-4xl fw-bold mb-md">Aprende pseudocódigo con AlgLab</h1>
                        <p className="text-lg text-gray leading-relaxed">
                            Aprende a crear algoritmos utilizando
                            pseudocódigo de una forma sencilla,
                            visual y práctica.
                        </p>
                    </div>

                    <Section id="introduccion" title="Introducción">
                        <p className="mb-md text-gray">
                            AlgLab es un entorno de aprendizaje para
                            algoritmos y programación. Permite escribir
                            pseudocódigo, ejecutarlo, visualizar su
                            flujo y posteriormente convertirlo a
                            diferentes lenguajes de programación.
                        </p>

                        <p className="mb-md text-gray">
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

                    <Section id="primer-algoritmo" title="Tu primer algoritmo">
                        <p className="mb-md">El siguiente programa muestra un mensaje en pantalla:</p>
                        <FragmentCode code={`Algoritmo HolaMundo | Escribir "Hola mundo" | FinAlgoritmo`} />
                        <p className="mt-md">
                            Todo algoritmo comienza con{" "}
                            <code className="bg-dark p-xs rounded-sm">Algoritmo</code> y termina con{" "}
                            <code className="bg-dark p-xs rounded-sm">FinAlgoritmo</code>.
                        </p>
                    </Section>

                    <Section id="estructura" title="Estructura básica">
                        <FragmentCode code={`Algoritmo NombreDelAlgoritmo | // Instrucciones | FinAlgoritmo`} />
                        <div className="mt-md">
                            <ul className="list-disc pl-lg space-y-sm">
                                <li><strong>Algoritmo</strong> define el inicio del programa.</li>
                                <li>El nombre identifica al algoritmo.</li>
                                <li>Las instrucciones se escriben dentro del algoritmo.</li>
                                <li><strong>FinAlgoritmo</strong> indica el final.</li>
                            </ul>
                        </div>
                    </Section>

                    <Section id="variables" title="Variables" >
                        <p className="mb-md">Las variables almacenan información que puede utilizar el algoritmo.</p>
                        <FragmentCode code={`Definir edad Como Entero | Definir nombre Como Caracter | Definir precio Como Real | Definir activo Como Logico`} />
                        <p className="mt-md">La sintaxis general es:</p>
                        <FragmentCode code={`Definir edad Como Tipo`} />
                    </Section>

                    <Section id="tipos-datos" title="Tipos de datos">
                        <div className="overflow-auto">
                            <table className="w-full border-collapse bg-dark-secondary rounded-md">
                                <thead>
                                    <tr className="border-bottom">
                                        <th className="text-left p-sm">Tipo</th>
                                        <th className="text-left p-sm">Descripción</th>
                                        <th className="text-left p-sm">Ejemplo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-bottom">
                                        <td className="p-sm text-center text-sm text-gray">Entero</td>
                                        <td className="p-sm text-center text-sm text-gray">Números sin decimales</td>
                                        <td className="p-sm text-center text-sm text-gray">25</td>
                                    </tr>
                                    <tr className="border-bottom">
                                        <td className="p-sm text-center text-sm text-gray">Real</td>
                                        <td className="p-sm text-center text-sm text-gray">Números decimales</td>
                                        <td className="p-sm text-center text-sm text-gray">19.5</td>
                                    </tr>
                                    <tr className="border-bottom">
                                        <td className="p-sm text-center text-sm text-gray">Caracter</td>
                                        <td className="p-sm text-center text-sm text-gray">Texto</td>
                                        <td className="p-sm text-center text-sm text-gray">"Carlos"</td>
                                    </tr>
                                    <tr>
                                        <td className="p-sm text-center text-sm text-gray">Logico</td>
                                        <td className="p-sm text-center text-sm text-gray">Verdadero o Falso</td>
                                        <td className="p-sm text-center text-sm text-gray">Verdadero</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Section>

                    <Section id="asignacion" title="Asignación">
                        <p className="mb-md">Puedes almacenar un valor utilizando el operador de asignación.</p>
                        <FragmentCode code={`Definir edad Como Entero | \t\t edad <- 20 | Escribir edad`} />
                        <p className="mt-md text-gray">También puedes utilizar expresiones:</p>
                        <FragmentCode  code={`Definir a Como Entero | Definir b Como Entero | Definir resultado Como Entero | \t\ta <- 10 | \t\tb <- 5 | resultado <- a + b`} />
                    </Section>

                    <Section id="entrada-salida" title="Entrada y salida">
                        <h3 className="text-lg fw-semibold mb-sm">Escribir</h3>
                        <p className="mb-md text-gray">Muestra información en la terminal.</p>
                        <FragmentCode code={`Escribir "Hola" | Escribir 25 | Escribir nombre`} />
                        <h3 className="text-lg fw-semibold mt-lg mb-sm">Leer</h3>
                        <p className="mb-md text-gray">Solicita información al usuario.</p>
                        <FragmentCode code={`Definir nombre Como Caracter | Escribir "¿Cuál es tu nombre?" | Leer nombre | Escribir nombre`} />
                    </Section>

                    <Section id="aritmeticos" title="Operadores aritméticos">
                        <div className="overflow-auto">
                            <table className="w-full bg-dark-secondary text-white border-collapse rounded-md">
                                <thead>
                                    <tr className="border-bottom">
                                        <th className="text-left p-sm">Operador</th>
                                        <th className="text-left p-sm">Operación</th>
                                        <th className="text-left p-sm">Ejemplo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-bottom text-center text-gray text-sm">
                                        <td className="p-sm">+</td>
                                        <td className="p-sm">Suma</td>
                                        <td className="p-sm">a + b</td>
                                    </tr>
                                    <tr className="border-bottom text-center text-gray text-sm">
                                        <td className="p-sm">-</td>
                                        <td className="p-sm">Resta</td>
                                        <td className="p-sm">a - b</td>
                                    </tr>
                                    <tr className="border-bottom text-center text-gray text-sm">
                                        <td className="p-sm">*</td>
                                        <td className="p-sm">Multiplicación</td>
                                        <td className="p-sm">a * b</td>
                                    </tr>
                                    <tr className="border-bottom text-center text-gray text-sm">
                                        <td className="p-sm">/</td>
                                        <td className="p-sm">División</td>
                                        <td className="p-sm">a / b</td>
                                    </tr>
                                    <tr className="text-center text-gray text-sm">
                                        <td className="p-sm">%</td>
                                        <td className="p-sm">Módulo</td>
                                        <td className="p-sm">a % b | a MOD b</td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    </Section>

                    <Section id="relacionales" title="Operadores relacionales">
                        <div className="overflow-auto">
                            <table className="w-full bg-dark-secondary text-white border-collapse rounded-md">
                                <thead>
                                    <tr className="border-bottom">
                                        <th className="text-left p-sm">Operador</th>
                                        <th className="text-left p-sm">Operación</th>
                                        <th className="text-left p-sm">Ejemplo</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr className="border-bottom text-center text-gray text-sm">
                                        <td className="p-sm">&gt;</td>
                                        <td className="p-sm">Mayor que</td>
                                        <td className="p-sm">a &gt; b</td>
                                    </tr>

                                    <tr className="border-bottom text-center text-gray text-sm">
                                        <td className="p-sm">&gt;=</td>
                                        <td className="p-sm">Mayor o igual que</td>
                                        <td className="p-sm">a &gt;= b</td>
                                    </tr>

                                    <tr className="border-bottom text-center text-gray text-sm">
                                        <td className="p-sm">&lt;</td>
                                        <td className="p-sm">Menor que</td>
                                        <td className="p-sm">a &lt; b</td>
                                    </tr>

                                    <tr className="border-bottom text-center text-gray text-sm">
                                        <td className="p-sm">&lt;=</td>
                                        <td className="p-sm">Menor o igual que</td>
                                        <td className="p-sm">a &lt;= b</td>
                                    </tr>

                                    <tr className="border-bottom text-center text-gray text-sm">
                                        <td className="p-sm">=</td>
                                        <td className="p-sm">Igual que</td>
                                        <td className="p-sm">a = b</td>
                                    </tr>

                                    <tr className="text-center text-gray text-sm">
                                        <td className="p-sm">&lt;&gt;</td>
                                        <td className="p-sm">Diferente de</td>
                                        <td className="p-sm">a &lt;&gt; b</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-md text-gray">Estos operadores producen un valor lógico.</p>
                        <FragmentCode code={`edad >= 18 | precio < 100 | nombre = "Carlos"`}/>
                    </Section>

                    <Section id="logicos" title="Operadores lógicos">
                        <FragmentCode code={`//Y O NO |edad >= 18 Y edad <= 60 | edad = 18 O edad = 19 | NO activo`}/>
                    </Section>

                    <Section id="si" title="Condicional Si">
                        <p className="mb-md">Permite ejecutar diferentes instrucciones dependiendo de una condición.</p>
                        <FragmentCode code={`Si edad >= 18 Entonces | Escribir "Mayor de edad" | Sino | Escribir "Menor de edad" | FinSi`} />
                        <p className="mt-md">La sección <code>Sino</code> es opcional.</p>
                        <FragmentCode code={`Si edad >= 18 Entonces | Escribir "Mayor" | FinSi`}/>
                    </Section>

                    <Section id="mientras" title="Ciclo Mientras">
                        <p className="mb-md">Ejecuta un bloque mientras una condición sea verdadera.</p>
                        <FragmentCode code={`Definir contador Como Entero | \t\tcontador <- 1 | Mientras contador <= 5 Hacer | Escribir contador | contador <- contador + 1 | FinMientras`}/>
                    </Section>

                    <Section id="para" title="Ciclo Para">
                        <p className="mb-md">El ciclo Para es útil cuando conocemos el rango de repetición.</p>
                        <FragmentCode code={`Para i <- 1 Hasta 10 Con Paso 1 Hacer | Escribir i | FinPara`}/>
                        <p className="mt-md text-gray">También puedes utilizar pasos negativos:</p>
                        <FragmentCode code={`Para i <- 10 Hasta 1 Con Paso -1 Hacer | Escribir i | FinPara`}/>
                    </Section>

                    <Section id="reservadas" title="Palabras reservadas">
                        <p className="mb-md">Estas palabras tienen un significado especial dentro del lenguaje.</p>
                        <div className="flex flex-wrap gap-sm">
                            {KEYWORDS.map(word => (
                                <code key={word} className="bg-dark-secondary px-sm py-xs rounded-sm">{word}</code>
                            ))}
                        </div>
                    </Section>

                    <Section id="errores" title="Errores frecuentes">
                        <h3 className="text-lg fw-semibold mb-sm">Variable no declarada</h3>
                        <FragmentCode code={`edad <- 20`}/>
                        <p className="mt-sm mb-lg">Antes de utilizar una variable debes declararla.</p>
                        <FragmentCode code={`Definir edad Como Entero | edad <- 20`}/>
                        <h3 className="text-lg fw-semibold mt-lg mb-sm">División entre cero</h3>
                        <FragmentCode code={`resultado <- 10 / 0`}/>
                        <p className="mt-sm">No es posible dividir entre cero.</p>
                        <h3 className="text-lg fw-semibold mt-lg mb-sm">Ciclo infinito</h3>
                        <FragmentCode code={`contador <- 1 | Mientras contador <= 10 Hacer | Escribir contador | FinMientras`} />
                        <p className="mt-sm">La condición nunca cambia porque<code>contador</code> no se incrementa.</p>
                    </Section>

                    <Section id="ejemplo-completo" title="Ejemplo completo">
                        <p className="mb-md">El siguiente algoritmo solicita la edad de una persona y determina si es mayor o menor de edad.</p>
                        <FragmentCode code={`Algoritmo Edad | Definir edad Como Entero | Escribir "¿Cuál es tu edad?" | Leer edad | Si edad >= 18 Entonces | Escribir "Eres mayor de edad" | Sino | Escribir "Eres menor de edad" | FinSi | FinAlgoritmo`}/>
                        <div className="bg-green-50 border border-green-200 p-md rounded-md mt-lg">
                            <strong>¿Qué aprendiste?</strong>
                            <ul className="list-disc pl-lg mt-sm">
                                <li className="text-gray-800 hover:text-gray">Declarar una variable.</li>
                                <li className="text-gray-800 hover:text-gray">Solicitar información.</li>
                                <li className="text-gray-800 hover:text-gray">Mostrar información.</li>
                                <li className="text-gray-800 hover:text-gray">Comparar valores.</li>
                                <li className="text-gray-800 hover:text-gray">Utilizar una condición.</li>
                            </ul>
                        </div>
                    </Section>

                    <div className="border-top flex items-center justify-between pt-lg mt-xl text-sm text-gray">
                        <p>AlgLab · Documentación del lenguaje</p>
                        <p className="">Aprende algoritmos. Visualiza el flujo. Programa.</p>
                    </div>

                </main>

            </div>

        </div>
    );
}