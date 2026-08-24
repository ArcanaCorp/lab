export type RuntimeValue =
    | number
    | string
    | boolean
    | null;

export function isNumber(value: RuntimeValue): value is number {
    return typeof value === "number";
}

export function isString(value: RuntimeValue): value is string {
    return typeof value === "string";
}

export function isBoolean(value: RuntimeValue): value is boolean {
    return typeof value === "boolean";
}