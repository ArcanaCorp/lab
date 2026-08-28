export const KEYWORDS = [
    "Algoritmo",
    "FinAlgoritmo",

    "Definir",
    "Como",

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

    "Repetir",
    "HastaQue",

    "Segun",
    "Caso",
    "DeOtroModo",
    "FinSegun",

    "Verdadero",
    "Falso",

    "Y",
    "O",
    "No",
];

const TYPES = [
    "Entero",
    "Real",
    "Caracter",
    "Logico",
];

function escapeHtml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function highlightLine(line) {

    // Comentario completo
    if (line.trim().startsWith("//")) {
        return `<span class="syntax-comment">${escapeHtml(line)}</span>`;
    }

    const tokenRegex =
        /("(?:\\.|[^"\\])*")|(\b\d+(?:\.\d+)?\b)|([A-Za-zÁÉÍÓÚáéíóúÑñ_][A-Za-zÁÉÍÓÚáéíóúÑñ0-9_]*)/g;

    let result = "";
    let lastIndex = 0;

    for (const match of line.matchAll(tokenRegex)) {

        const index = match.index;

        // Texto antes del token
        result += escapeHtml(
            line.slice(lastIndex, index)
        );

        const token = match[0];

        // String
        if (match[1]) {

            result +=
                `<span class="syntax-string">` +
                escapeHtml(token) +
                `</span>`;
        }

        // Número
        else if (match[2]) {

            result +=
                `<span class="syntax-number">` +
                token +
                `</span>`;
        }

        // Palabra
        else if (match[3]) {

            const word = match[3];

            if (
                KEYWORDS.some(
                    keyword =>
                        keyword.toLowerCase() === word.toLowerCase()
                )
            ) {

                result +=
                    `<span class="syntax-keyword">` +
                    escapeHtml(word) +
                    `</span>`;
            }

            else if (
                TYPES.some(
                    type =>
                        type.toLowerCase() === word.toLowerCase()
                )
            ) {

                result +=
                    `<span class="syntax-type">` +
                    escapeHtml(word) +
                    `</span>`;
            }

            else {

                result += escapeHtml(word);
            }
        }

        lastIndex = index + token.length;
    }

    // Resto de la línea
    result += escapeHtml(
        line.slice(lastIndex)
    );

    return result;
}

export function formatInlineCode(code) {
    if (!code) return "";

    return code
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .split("|")
        .map(line => {
            // IMPORTANTE: NO hacer trim() antes de detectar indentación

            // Convertimos tabs iniciales a 4 espacios
            const tabMatch = line.match(/^(\t+)/);
            const tabs = tabMatch ? tabMatch[1].length : 0;

            // Quitamos tabs iniciales
            line = line.slice(tabs);

            // Detectamos espacios iniciales
            const spaceMatch = line.match(/^( +)/);
            const spaces = spaceMatch ? spaceMatch[1].length : 0;

            // Quitamos espacios originales
            line = line.slice(spaces).trim();

            if (!line) return "";

            // Cada tab = 4 espacios
            const indentation = " ".repeat(
                (tabs * 4) + spaces
            );

            return indentation + line;
        })
        .filter(Boolean)
        .join("\n");
}

export function highlightCode(code) {

    if (!code) return "";

    return code
        .split("\n")
        .map(line => {

            /*
             * Extraemos la indentación.
             */
            const match = line.match(/^(\t*)/);

            const indentation = match
                ? match[1]
                : "";

            const content = line.slice(
                indentation.length
            );

            return (
                indentation +
                highlightLine(content)
            );
        })
        .join("\n");
}