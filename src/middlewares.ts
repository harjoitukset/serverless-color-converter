/*
 * Middleware functions to validate and extract query parameters for color conversion.
 * Middlewares can help keep the route handlers clean and focused on their main logic, while
 * handling repetitive tasks like validation and parsing in a reusable way.
 * 
 * Middlewares are covered in the Hono documentation: https://hono.dev/docs/guides/middleware
 */

import { createMiddleware } from "hono/factory";
import { hexToRgb, rgbToHex } from "./converters";
import { HEX, RGB } from "./types";

/**
 * Middleware that validates and extracts a HEX color from the query parameters.
 * If valid, it stores the HEX value in the context variables for use in the route handler.
 * If invalid or missing, it responds with a 400 error.
 */
export const hexMiddleware = createMiddleware<{ Variables: { hex: HEX } }>(async (c, next) => {
    const hex = c.req.query('hex');

    if (hex && validateHex(hex)) {
        c.set('hex', hex);
        await next();
    } else {
        console.error('Invalid HEX value', hex);
        return c.text('Invalid HEX value', 400);
    }
});

/**
 * Middleware that validates and extracts RGB color components from the query parameters.
 * If valid, it stores the RGB value in the context variables for use in the route handler.
 * If invalid or missing, it responds with a 400 error.
 */
export const rgbMiddleware = createMiddleware<{ Variables: { rgb: RGB } }>(async (c, next) => {
    // extract and convert all three query parameters in one go
    const [r, g, b] = ["r", "g", "b"].map(key => Number(c.req.query(key)));

    if (validateRgb({ r, g, b })) {
        c.set('rgb', { r, g, b });
        await next();
    } else {
        console.error('Invalid RGB values', r, g, b);
        return c.text('Invalid RGB values', 400);
    }
});

/**
 * Middleware that accepts either HEX or RGB query parameters, and at least one must be provided.
 * If both are provided, HEX takes precedence. The color values are converted and stored in both formats
 * in the context variables for use in the route handler.
 */
export const anyColorMiddleware = createMiddleware<{ Variables: { hex: HEX, rgb: RGB } }>(async (c, next) => {
    const hex = c.req.query('hex');
    const [r, g, b] = ["r", "g", "b"].map(key => Number(c.req.query(key)));

    if (hex && validateHex(hex)) {
        c.set('hex', hex);
        c.set('rgb', hexToRgb(hex));
        return await next();
    }

    if (validateRgb({ r, g, b })) {
        c.set('rgb', { r, g, b });
        c.set('hex', rgbToHex({ r, g, b }));
        return await next();
    }

    console.error('Invalid color values', { hex, r, g, b });
    return c.text('Invalid color values', 400);
});

const validateRgb = ({ r, g, b }: RGB): boolean => {
    return [r, g, b].every(n => !Number.isNaN(n) && n >= 0 && n <= 255);
};

const validateHex = (hex: string): boolean => {
    return /^#[0-9A-F]{6}$/.test(hex);
};
