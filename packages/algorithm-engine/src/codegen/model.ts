export type TargetLanguage =
    | "javascript"
    | "python"
    | "php"
    | "java";

export interface GeneratedCode {
    language: TargetLanguage;
    code: string;
}