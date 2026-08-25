import type { PrimitiveType } from "../ast/types";
import type { RuntimeValue } from "./value";
import { RuntimeError } from "./runtime-error";

export interface EnvironmentVariable {
    value: RuntimeValue;
    dataType: PrimitiveType;
}

export class Environment {

    private readonly values = new Map<string, RuntimeValue>();

    private readonly types = new Map<string, PrimitiveType>();

    define(
        name: string,
        value: RuntimeValue = null,
        dataType: PrimitiveType = "Caracter"
    ): void {
        this.values.set(name, value);
        this.types.set(name, dataType);
    }

    set(name: string, value: RuntimeValue): void {
        if (!this.values.has(name)) {
            throw new RuntimeError(
                `La variable '${name}' no ha sido declarada.`
            );
        }

        this.values.set(name, value);
    }

    get(name: string): RuntimeValue {
        if (!this.values.has(name)) {
            throw new RuntimeError(
                `La variable '${name}' no está definida.`
            );
        }

        return this.values.get(name)!;
    }

    getType(name: string): PrimitiveType {
        if (!this.types.has(name)) {
            throw new RuntimeError(
                `La variable '${name}' no está definida.`
            );
        }

        return this.types.get(name)!;
    }

    has(name: string): boolean {
        return this.values.has(name);
    }

    snapshot(): Record<string, RuntimeValue> {
        return Object.fromEntries(this.values.entries());
    }

    clear(): void {
        this.values.clear();
        this.types.clear();
    }
}