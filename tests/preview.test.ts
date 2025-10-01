import app from '../src/index';
import { describe, it, expect } from 'vitest';

describe("color preview", () => {

    it('should respond with 200 OK and a HTML page', async () => {
        const response = await app.request('/preview?hex=%23FF0000');

        expect(response.status).toBe(200);
        expect((await response.text()).toLowerCase()).toContain('html');
    });

    it('should display a background color when given a HEX code', async () => {
        const response = await app.request('/preview?hex=%23FF69B4');

        expect((await response.text()).toLowerCase()).toContain('background');
    });

    it('should display a background color when given a RGB color', async () => {
        const response = await app.request('/preview?r=255&g=105&b=180');

        expect((await response.text()).toLowerCase()).toContain('background');
    });

    it('should not show unsafe submitted HEX values in the output', async () => {
        const response = await app.request('/preview?hex=<script>alert("Hacked!")</script>');

        expect((await response.text()).toLowerCase()).not.toContain('<script>alert("hacked!")</script>');
    });

    it('should not show unsafe submitted RGB values in the output', async () => {
        const response = await app.request('/preview?r=<script>alert("Hacked!")</script>&g=255&b=255');

        expect((await response.text()).toLowerCase()).not.toContain('<script>alert("hacked!")</script>');
    });
});
