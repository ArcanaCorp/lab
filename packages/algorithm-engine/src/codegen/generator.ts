import type { Program } from "../ast";
import type { GeneratedCode, TargetLanguage } from "./model";

import { generateJavaScript } from "./generators/javascript";
import { generatePython } from "./generators/python";
import { generatePhp } from "./generators/php";
import { generateJava } from "./generators/java";

export function generateCode(program: Program, language: TargetLanguage) : GeneratedCode {

    let code: string;

    switch (language) {

        case "javascript":
            code = generateJavaScript(program);
            break;

        case "python":
            code = generatePython(program);
            break;

        case "php":
            code = generatePhp(program);
            break;

        case "java":
            code = generateJava(program);
            break;

        default:
            throw new Error(
                `Lenguaje no soportado: ${language}`
            );
    }

    return {
        language,
        code
    };
}