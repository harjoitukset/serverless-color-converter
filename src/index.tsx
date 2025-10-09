import { Hono } from 'hono';
import { FrontPage, Page } from './components';
import { hexToRgb, rgbToHex } from './converters';
import { anyColorMiddleware, hexMiddleware, rgbMiddleware } from './middlewares';

const app = new Hono();

app.get('/', (c) => {
  return c.html(<FrontPage />);
});

app.get('/hex-to-rgb', hexMiddleware, (c) => {
  const hex = c.var.hex;

  return c.json(hexToRgb(hex));
});

app.get('/rgb-to-hex', rgbMiddleware, (c) => {
  const rgb = c.var.rgb;

  return c.json({
    hex: rgbToHex(rgb)
  });
});

app.get('/preview', anyColorMiddleware, (c) => {
  const hex = c.var.hex;
  const rgb = c.var.rgb;

  return c.html(
    <Page background={hex}>
      <h1>Color Preview: {hex}, {JSON.stringify(rgb)}</h1>
    </Page>
  );
});

export default app;
