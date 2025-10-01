import app from '../src/index';
import { describe, it, expect } from 'vitest';

describe("hex to rgb converter", () => {

    it('should respond with 200 OK and a JSON object', async () => {
        const response = await app.request('/hex-to-rgb?hex=%23FF0000');
        expect(response.status).toBe(200);
        expect(typeof await response.json()).toBe('object');
    });

    it('should convert HEX to RGB', async () => {
        const response = await app.request('/hex-to-rgb?hex=%23FF0000');
        expect(await response.json()).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should convert HEX to RGB with different values', async () => {
        const response = await app.request('/hex-to-rgb?hex=%2340E0D0');
        expect(await response.json()).toEqual({ r: 64, g: 224, b: 208 });
    });
});
