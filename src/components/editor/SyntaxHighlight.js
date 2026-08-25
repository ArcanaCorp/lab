import { KEYWORDS } from "../../../packages/algorithm-engine/src/lexer/keywords";

const keywordSet = new Set(
    Object.keys(KEYWORDS).map((keyword) => keyword.toUpperCase())
);

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function highlightLine(line) {
    const escaped = escapeHtml(line);

    return escaped.replace(
        /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b\d+(?:\.\d+)?\b|\b[A-Za-zÁÉÍÓÚÜÑáéíóúüñ_][A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9_]*\b)/g,
        (token) => {

            if (
                token.startsWith('"') ||
                token.startsWith("'")
            ) {
                return `<span class="syntax-string">${token}</span>`;
            }

            if (/^\d+(?:\.\d+)?$/.test(token)) {
                return `<span class="syntax-number">${token}</span>`;
            }

            if (keywordSet.has(token.toUpperCase())) {
                return `<span class="syntax-keyword">${token}</span>`;
            }

            return token;
        }
    );
}

export function highlightCode(source) {
    return source
        .split("\n")
        .map(highlightLine)
        .join("\n");
}