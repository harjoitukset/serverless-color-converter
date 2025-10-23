import type { Context } from "hono";

export type AppContext = Context<{ Bindings: CloudflareBindings }>;
export type HandleArgs = [AppContext];

export class Color {
    constructor(
        readonly r: number,
        readonly g: number,
        readonly b: number
    ) {
        if (!Color.validateRgb({ r, g, b })) {
            throw new Error(`invalid rgb values ${r}, ${g}, ${b}`);
        }
    }

    static parseHex(hex: string): Color {
        if (!Color.validateHex(hex)) {
            throw new Error(`invalid hex values ${hex}`);
        }
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        return new Color(r, g, b);
    }

    static validateHex(hex: string) {
        return /^#[0-9A-F]{6}$/.test(hex);
    }

    static validateRgb({ r, g, b }: { r: number, g: number, b: number }) {
        return [r, g, b].every(n => !Number.isNaN(n) && n >= 0 && n <= 255);
    }

    toHex(): string {
        const convert = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();

        return '#' + convert(this.r) + convert(this.g) + convert(this.b);
    }
}
