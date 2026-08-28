import { formatInlineCode, highlightCode } from "../helper/code.helper";

export default function FragmentCode({code, language = "alglab"}) {
    
    const formattedCode = formatInlineCode(code)
    const highlightedCode = highlightCode(formattedCode);

    return (
        <pre className={`code-block bg-dark-secondary rounded-md p-md language-${language}`}>
            <code dangerouslySetInnerHTML={{__html: highlightedCode}} />
        </pre>
    );
}