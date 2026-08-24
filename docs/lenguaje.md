# Especificación del lenguaje AlgLab

## Alcance

AlgLab es un pseudolenguaje imperativo, insensible a mayúsculas y minúsculas, pensado para algoritmos introductorios. Cada archivo contiene exactamente un algoritmo delimitado por `Algoritmo` y `FinAlgoritmo`. Los identificadores usan letras, números y `_`, y deben empezar por una letra o `_`.

## Gramática

```ebnf
programa       = "Algoritmo", identificador, salto*, sentencia*, "FinAlgoritmo" ;
sentencia      = declaracion | lectura | escritura | asignacion | condicional | mientras | para ;
declaracion    = "Definir", identificador, "Como", tipo ;
tipo           = "Entero" | "Real" | "Caracter" | "Logico" ;
lectura        = "Leer", identificador ;
escritura      = "Escribir", expresion ;
asignacion     = identificador, "<-", expresion ;
condicional    = "Si", expresion, "Entonces", salto*, sentencia*, [ "SiNo", salto*, sentencia* ], "FinSi" ;
mientras       = "Mientras", expresion, "Hacer", salto*, sentencia*, "FinMientras" ;
para           = "Para", identificador, "<-", expresion, "Hasta", expresion, [ "Con", "Paso", expresion ], "Hacer", salto*, sentencia*, "FinPara" ;
expresion      = unaria, { operadorBinario, unaria } ;
unaria         = [ "-" | "No" ], primaria ;
primaria       = numero | cadena | identificador | "(", expresion, ")" ;
```

La precedencia, de mayor a menor, es: unarios (`-`, `No`), `*` `/` `%`, `+` `-`, comparaciones (`>`, `>=`, `<`, `<=`, `=`, `<>`), `Y`, `O`. Los binarios se asocian a la izquierda. Las cadenas se escriben entre comillas dobles; los números admiten enteros y decimales con punto. El valor predeterminado de `Entero` y `Real` es `0`, de `Caracter` es `""` y de `Logico` es `falso`.

## Ejemplo

```text
Algoritmo Suma
Definir total Como Entero
total <- 0
Para i <- 1 Hasta 3 Hacer
  total <- total + i
FinPara
Escribir total
FinAlgoritmo
```

## Diagnósticos y errores

Los errores léxicos detienen el análisis: carácter inesperado y posición. Los errores sintácticos también detienen el análisis y reportan línea y columna; por ejemplo, falta de delimitador, nombre, tipo, expresión o cierre de bloque. La interfaz los expone con el código `PARSE_ERROR`.

El análisis semántico continúa cuando la sintaxis es válida y entrega diagnósticos:

| Código | Condición |
| --- | --- |
| `E001` | Se usa una variable sin declarar en una expresión. |
| `E002` | Una variable se declara más de una vez. |
| `SEM002` | Se asigna o lee una variable sin declarar. |

Durante la ejecución se producen errores cuando se usa una variable no definida, falta un proveedor para `Leer`, el proveedor de entrada asíncrono se usa con ejecución síncrona, se divide o calcula módulo entre cero, un operador numérico recibe otro tipo, se comparan tipos incompatibles o `Para` usa paso `0`.
