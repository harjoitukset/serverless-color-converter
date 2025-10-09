import { HEX, RGB } from "./types";

export function hexToRgb(hex: HEX): RGB {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return { r, g, b };
}

export function rgbToHex(rgb: RGB): HEX {
    const { r, g, b } = rgb;
    return '#' + toHex(r) + toHex(g) + toHex(b);
}

function toHex(n: number): string {
    return n.toString(16).padStart(2, '0').toUpperCase();
}
