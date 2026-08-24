import type { RuntimeValue } from "./value";
import { RuntimeError } from "./runtime-error";

export class Environment {
    private readonly values = new Map<string, RuntimeValue>();

    define(name: string, value: RuntimeValue = null): void {
        this.values.set(name, value);
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

    has(name: string): boolean {
        return this.values.has(name);
    }

    snapshot(): Record<string, RuntimeValue> {
        return Object.fromEntries(this.values.entries());
    }

    clear(): void {
        this.values.clear();
    }
}