import app from '../src/index';
import { describe, it, expect } from 'vitest';

describe("rgb to hex converter", () => {

    it('should respond with 200 OK', async () => {
        const response = await app.request('/rgb-to-hex?r=255&g=0&b=0');
        expect(response.status).toBe(200);
    });

    it('should convert RGB to HEX', async () => {
        const response = await app.request('/rgb-to-hex?r=255&g=0&b=0');
        expect(await response.text()).toContain('#FF0000');
    });

    it('should convert RGB to HEX with different values', async () => {
        const response = await app.request('/rgb-to-hex?r=64&g=224&b=208');
        expect(await response.text()).toContain('#40E0D0');
    });
});
