# AlgLab

AlgLab es un entorno web educativo para escribir, analizar y ejecutar algoritmos mediante pseudocódigo en español.

El proyecto permite escribir algoritmos utilizando una sintaxis similar a la empleada en herramientas educativas como PSeInt, analizar el código, detectar errores, ejecutarlo de forma interactiva y visualizar diferentes representaciones del algoritmo.

La aplicación está dividida entre una interfaz web y un motor de ejecución independiente, lo que permite mantener separada la lógica del lenguaje de la interfaz.

---

## ¿Qué permite hacer?

AlgLab está pensado para acompañar el aprendizaje de programación desde el pseudocódigo.

Actualmente permite:

- Escribir pseudocódigo directamente desde el editor.
- Analizar sintáctica y semánticamente el algoritmo.
- Mostrar diagnósticos de errores.
- Ejecutar algoritmos.
- Ejecutar algoritmos paso a paso mediante un modelo de ejecución.
- Solicitar datos al usuario mediante `Leer`.
- Mantener el estado de las variables durante la ejecución.
- Mostrar la salida producida por `Escribir`.
- Ejecutar estructuras condicionales.
- Ejecutar ciclos `Mientras`.
- Ejecutar ciclos `Para`.
- Mostrar las variables y el estado actual de la ejecución.
- Visualizar el código generado en otros lenguajes.
- Cambiar entre JavaScript, Python, PHP y Java en el visor de código.
- Resaltar sintaxis según el lenguaje seleccionado.
- Visualizar el algoritmo mediante un modelo de flujograma.
- Minimizar y expandir el panel inferior del editor.

---

# Funcionamiento general

El flujo principal de AlgLab es:

```text
Pseudocódigo
     │
     ▼
    Lexer
     │
     ▼
   Tokens
     │
     ▼
   Parser
     │
     ▼
     AST
     │
     ▼
Análisis semántico
     │
     ├──────────────► Diagnósticos
     │
     ▼
   Ejecución
     │
     ├──────────────► Terminal
     │
     ├──────────────► Variables
     │
     └──────────────► Estado de ejecución
````

El mismo AST puede utilizarse posteriormente para generar otras representaciones:

```text
                  AST
                   │
          ┌────────┼────────┐
          ▼        ▼        ▼
       Runtime   Generator  Flowchart
          │        │        │
          ▼        ▼        ▼
       Ejecución  Código   Diagrama
```

Esto permite que las diferentes funcionalidades trabajen sobre una representación común del algoritmo.

---

# Arquitectura

El proyecto utiliza una arquitectura de monorepo mediante npm workspaces.

```text
AlgLab
│
├── src/
│   ├── app/
│   ├── components/
│   ├── context/
│   └── lib/
│
├── packages/
│   └── algorithm-engine/
│       └── src/
│
├── docs/
│
└── package.json
```

## Aplicación web

La aplicación principal está construida con Next.js y React.

Entre sus responsabilidades están:

* Editor de pseudocódigo.
* Gestión del algoritmo actual.
* Ejecución del programa.
* Visualización de resultados.
* Panel de terminal.
* Panel de errores.
* Consola de depuración.
* Visor de código generado.
* Visualización del flujograma.

La interfaz utiliza componentes React independientes para cada una de estas responsabilidades.

---

# `algorithm-engine`

El núcleo del proyecto se encuentra en:

```text
packages/algorithm-engine
```

Este paquete contiene la implementación del lenguaje y no depende de React ni de la interfaz web.

Su responsabilidad es transformar el pseudocódigo en una estructura que pueda ser analizada, ejecutada y representada.

Conceptualmente:

```text
Código fuente
     │
     ▼
   Lexer
     │
     ▼
   Parser
     │
     ▼
     AST
     │
     ├──► Análisis
     │
     ├──► Runtime
     │
     ├──► Generación de código
     │
     └──► Flujograma
```

Esto permite utilizar el motor independientemente de la aplicación web.

---

# Lexer

El lexer recibe el código fuente y lo transforma en tokens.

Por ejemplo:

```text
Definir contador Como Entero
```

se convierte conceptualmente en tokens equivalentes a:

```text
Definir
Identificador(contador)
Como
Entero
```

El lexer también identifica elementos como:

* Palabras reservadas.
* Identificadores.
* Números.
* Cadenas.
* Operadores.
* Símbolos.
* Separadores.

Los errores léxicos se convierten en diagnósticos asociados a su ubicación en el código.

---

# Parser y AST

El parser recibe los tokens generados por el lexer y construye un árbol de sintaxis abstracta (AST).

Por ejemplo:

```text
contador <- contador + 1
```

se representa mediante una estructura equivalente a:

```text
Assignment
├── variable: contador
└── value
    └── BinaryExpression
        ├── left: contador
        ├── operator: +
        └── right: 1
```

El AST es la representación central del algoritmo.

Esto evita que cada funcionalidad tenga que interpretar directamente el texto original.

---

# Ejecución

La ejecución se encuentra principalmente en:

```text
packages/algorithm-engine/src/runtime
```

El runtime mantiene:

* Variables.
* Tipos.
* Valores.
* Salida.
* Estado de ejecución.
* Entrada del usuario.

El entorno de variables está gestionado mediante `Environment`.

Por ejemplo, después de ejecutar:

```text
Definir cantidad Como Entero
cantidad <- 12
```

el entorno puede contener:

```text
cantidad = 12
```

---

# Ejecución interactiva

Una de las partes principales del runtime es la ejecución interactiva.

A diferencia de una ejecución tradicional en la que todo el programa se ejecuta de principio a fin, AlgLab puede detenerse cuando el algoritmo necesita una entrada.

Por ejemplo:

```text
Escribir "Ingrese la cantidad:"
Leer cantidad
```

produce un estado similar a:

```text
{
    "status": "waiting-input",
    "inputRequest": {
        "variable": "cantidad"
    }
}
```

La interfaz muestra entonces un campo de entrada en el panel Terminal.

Cuando el usuario proporciona el valor, el runtime:

1. Convierte el texto al tipo de la variable.
2. Actualiza el entorno.
3. Continúa la ejecución desde el punto donde se detuvo.

Esto permite ejecutar programas interactivos sin bloquear la interfaz.

---

# Execution y Frames

La ejecución paso a paso utiliza un modelo basado en frames.

```text
Execution
    │
    ▼
ProgramFrame
    │
    ▼
BlockFrame
    │
    ├── sentencia
    ├── sentencia
    ├── IfFrame
    │     └── BlockFrame
    │
    ├── WhileFrame
    │     └── BlockFrame
    │
    └── ForFrame
          └── BlockFrame
```

`Execution` mantiene el estado general de la ejecución.

`ProgramFrame` representa el programa completo.

`BlockFrame` controla la ejecución secuencial de un bloque.

Las estructuras de control utilizan frames especializados para poder conservar su estado cuando la ejecución se pausa.

Esto es especialmente importante para los ciclos que contienen instrucciones `Leer`.

Por ejemplo:

```text
Mientras contador <= cantidad Hacer

    Escribir "Ingrese la nota"
    Leer nota

    contador <- contador + 1

FinMientras
```

puede detenerse en `Leer nota`, recibir el valor y continuar exactamente desde ese punto sin reiniciar el ciclo.

---

# Estados de ejecución

La ejecución utiliza diferentes estados para representar su situación actual.

Entre ellos:

```text
idle
paused
running
waiting-input
completed
error
```

Por ejemplo:

```text
idle
  │
  ▼
paused
  │
  ▼
running
  │
  ├──────────────► waiting-input
  │                    │
  │                 entrada
  │                    │
  │                    ▼
  └──────────────── paused
                       │
                       ▼
                   completed
```

Esto permite que la interfaz reaccione al estado del runtime.

---

# Entrada de datos

`Leer` es gestionado mediante `ExecutionContext`.

Cuando se encuentra una sentencia de entrada:

```text
Leer nota
```

el contexto registra:

```text
requestedVariable = "nota"
```

y la ejecución pasa a:

```text
waiting-input
```

Cuando el usuario introduce un valor, este se convierte según el tipo declarado.

Actualmente se contemplan:

```text
Entero
Real
Caracter
Logico
```

Por ejemplo:

```text
Definir edad Como Entero
Leer edad
```

requiere un valor entero.

Mientras que:

```text
Definir promedio Como Real
Leer promedio
```

acepta un valor numérico.

---

# Sintaxis del lenguaje

AlgLab utiliza pseudocódigo en español.

Un algoritmo tiene la forma general:

```text
Algoritmo Nombre

    ...

FinAlgoritmo
```

## Variables

```text
Definir edad Como Entero
Definir promedio Como Real
Definir nombre Como Caracter
Definir aprobado Como Logico
```

## Asignación

```text
edad <- 20
promedio <- suma / cantidad
aprobado <- Verdadero
```

## Entrada

```text
Leer edad
```

## Salida

```text
Escribir "Hola"
Escribir promedio
```

La salida también puede combinar texto y expresiones:

```text
Escribir "Promedio: ", promedio
```

## Condicionales

```text
Si promedio >= 11 Entonces

    Escribir "Aprobado"

SiNo

    Escribir "Desaprobado"

FinSi
```

## Mientras

```text
Mientras contador <= cantidad Hacer

    Leer nota

    contador <- contador + 1

FinMientras
```

## Para

```text
Para contador <- 1 Hasta 10 Con Paso 1 Hacer

    Escribir contador

FinPara
```

## Operadores

Se soportan operaciones aritméticas:

```text
+
-
*
/
%
```

Comparaciones:

```text
>
>=
<
<=
=
<>
```

Operadores lógicos:

```text
Y
O
NO
```

---

# Generación de código

El AST también se utiliza para generar código equivalente en otros lenguajes.

Actualmente el visor permite seleccionar:

```text
JavaScript
Python
PHP
Java
```

El flujo es:

```text
AST
 │
 ▼
generateCode()
 │
 ├──► JavaScript
 ├──► Python
 ├──► PHP
 └──► Java
```

La generación está separada de la ejecución del pseudocódigo.

El código generado no sustituye al runtime: sirve como representación del algoritmo en un lenguaje de programación tradicional.

---

# Visor de código

El componente `CodeViewer` permite cambiar dinámicamente el lenguaje:

```text
┌─────────────────────────────┐
│ JavaScript             ▼    │
├─────────────────────────────┤
│ const contador = 0;         │
│                             │
│ while (...) {               │
│     ...                     │
│ }                           │
└─────────────────────────────┘
```

Además, el código generado utiliza resaltado de sintaxis según el lenguaje seleccionado.

Los lenguajes tienen sus propias reglas de highlighting, por lo que palabras reservadas, strings, números, comentarios y otras construcciones se muestran de acuerdo con la sintaxis correspondiente.

---

# Editor y panel inferior

El editor cuenta con un panel inferior dividido en tres vistas:

```text
┌──────────────────────────────────────┐
│ Terminal | Errores | Console         │
├──────────────────────────────────────┤
│                                      │
│ Contenido del panel                  │
│                                      │
└──────────────────────────────────────┘
```

## Terminal

Muestra la salida producida por `Escribir`.

También contiene el formulario utilizado para responder a las instrucciones `Leer`.

## Errores

Muestra los diagnósticos producidos durante el análisis:

```text
Código del diagnóstico
Mensaje
Línea
Columna
```

## Console

Muestra el estado completo de la ejecución, incluyendo:

* Estado.
* Sentencia actual.
* Variables.
* Salida.
* Solicitud de entrada.

Esto facilita la depuración del motor durante el desarrollo.

## Minimizar

El panel inferior puede minimizarse para liberar espacio vertical del editor.

Al minimizarlo, solamente permanece visible la barra de navegación del panel.

---

# Flujograma

El AST también puede utilizarse para representar visualmente el algoritmo.

Las estructuras del lenguaje pueden transformarse en nodos y conexiones:

```text
          ┌───────────┐
          │ Inicio    │
          └─────┬─────┘
                │
                ▼
          ┌───────────┐
          │ Leer dato │
          └─────┬─────┘
                │
                ▼
          ┌───────────┐
          │ condición │
          └─────┬─────┘
             Sí │ No
                │
                ▼
          ┌───────────┐
          │   ...     │
          └───────────┘
```

La representación visual utiliza el mismo modelo estructural del algoritmo, evitando tener que interpretar nuevamente el código fuente.

---

# Separación de responsabilidades

Uno de los objetivos principales del proyecto es mantener separadas las diferentes responsabilidades.

```text
┌───────────────────────────┐
│       Interfaz Web        │
│        Next.js/React      │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│      analyzeCode()        │
│   límite entre UI/motor   │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│     algorithm-engine      │
│                           │
│ Lexer                     │
│ Parser                    │
│ AST                       │
│ Análisis                  │
│ Runtime                   │
│ Generadores               │
│ Flujograma                │
└───────────────────────────┘
```

La interfaz no necesita conocer cómo se analiza una expresión ni cómo funciona internamente el parser.

De la misma manera, `algorithm-engine` no depende de componentes React.

Esto permite desarrollar y probar el motor independientemente de la interfaz.

---

# Estructura principal

Una vista simplificada del proyecto:

```text
src/
│
├── app/
│   └── editor/
│
├── components/
│   ├── editor/
│   │   ├── EditorWorkspace
│   │   ├── BottomPanel
│   │   └── CodeViewer
│   │
│   └── ...
│
├── context/
│   └── EditorContext
│
└── lib/
    └── algorithm/
        └── analyze-code.ts


packages/
│
└── algorithm-engine/
    │
    └── src/
        ├── ast/
        ├── lexer/
        ├── parser/
        ├── analyzer/
        ├── runtime/
        │   ├── execution.ts
        │   ├── execution-context.ts
        │   ├── environment.ts
        │   ├── runtime.ts
        │   └── frames/
        │       ├── program-frame.ts
        │       ├── block-frame.ts
        │       ├── if-frame.ts
        │       ├── while-frame.ts
        │       └── for-frame.ts
        │
        ├── generator/
        └── ...
```

---

# Principio de diseño

La idea central de AlgLab es que **el pseudocódigo sea la fuente común para todas las representaciones del algoritmo**.

A partir de un mismo programa se puede obtener:

```text
                  Pseudocódigo
                       │
                       ▼
                      AST
                       │
       ┌───────────────┼────────────────┐
       │               │                │
       ▼               ▼                ▼
    Runtime        Generador        Flujograma
       │               │                │
       ▼               ▼                ▼
   Ejecución         Código          Diagrama
       │
       ▼
 Terminal /
 Variables /
 Estado
```

De esta manera, agregar una nueva funcionalidad no requiere crear un nuevo intérprete del lenguaje.

Por ejemplo, un futuro generador para C++ podría trabajar directamente sobre el AST existente:

```text
AST
 │
 ├── JavaScript
 ├── Python
 ├── PHP
 ├── Java
 └── C++
```

---

# Objetivo del proyecto

AlgLab busca convertirse en una herramienta visual para aprender los fundamentos de programación utilizando pseudocódigo.

La ejecución paso a paso, la entrada interactiva, el estado de variables, los diagnósticos, la generación de código y el flujograma están orientados a que el usuario pueda observar no solamente **qué resultado produce un algoritmo**, sino también **cómo se ejecuta**.