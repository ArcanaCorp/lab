# AlgLab

AlgLab es un editor web para escribir pseudocódigo en español, analizarlo y ejecutarlo paso a paso. Combina una interfaz de Next.js con un motor independiente que transforma texto en tokens, AST, diagnósticos, ejecución y modelo de flujograma.

## Requisitos y ejecución

- Node.js `>=20.9.0` (se valida en `package.json`).
- npm, incluido con Node.

```bash
npm ci
npm run dev
```

Abre `http://localhost:3000`. Para una comprobación completa ejecuta:

```bash
npm run lint
npm run test
npm run build
```

## Sintaxis soportada

El lenguaje soporta algoritmos delimitados con `Algoritmo`/`FinAlgoritmo`, declaraciones (`Definir x Como Entero|Real|Caracter|Logico`), asignación con `<-`, `Leer`, `Escribir`, `Si`/`SiNo`/`FinSi`, `Mientras`/`FinMientras` y `Para ... Hasta ... [Con Paso ...] ... FinPara`.

Las expresiones admiten números, cadenas, variables, paréntesis, `+ - * / %`, comparadores, y `Y`, `O` y `No`. Consulta la [especificación formal](docs/lenguaje.md) para gramática, precedencia, diagnósticos y errores de ejecución.

## Arquitectura

```text
Editor React (textarea)
        │ texto
        ▼
analyzeCode (adaptador de UI)
        ▼
algorithm-engine: lexer → parser/AST → análisis semántico → runtime/flujograma
        │ diagnósticos
        ▼
Panel de errores
```

El motor vive en `packages/algorithm-engine` y no depende de React. `src/lib/algorithm/analyze-code.ts` es el límite entre interfaz y motor; el editor lo invoca al cambiar el código. Las pruebas incluyen unidades del motor y pruebas de integración parser→runtime y UI→adaptador→motor.

## Calidad y licencia

GitHub Actions ejecuta `lint`, `test` y `build` en cada push y pull request. El proyecto usa licencia [MIT](LICENSE).
