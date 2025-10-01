import app from '../src/index';
import { describe, test, expect } from 'vitest';

describe("error handling", () => {

    test('hex to rgb should return 400 for missing hex parameter', async () => {
        const response = await app.request('/hex-to-rgb');
        expect(response.status).toBe(400);
    });

    test('hex to rgb should return 400 for invalid hex', async () => {
        const response = await app.request('/hex-to-rgb?hex=invalid');
        expect(response.status).toBe(400);
    });

    test('rgb to hex should return 400 for missing parameters', async () => {
        const response = await app.request('/rgb-to-hex?r=255&g=0');
        expect(response.status).toBe(400);
    });

    test('rgb to hex should return 400 for out-of-range values', async () => {
        const response = await app.request('/rgb-to-hex?r=300&g=-10&b=256');
        expect(response.status).toBe(400);
    });

    test('preview should return 400 for missing parameters', async () => {
        const response = await app.request('/preview');
        expect(response.status).toBe(400);
    });
});
