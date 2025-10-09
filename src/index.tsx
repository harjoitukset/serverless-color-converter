import { Hono } from 'hono';
import { FrontPage, Page } from './components';
import { anyColorMiddleware, hexMiddleware, rgbMiddleware } from './middlewares';

const app = new Hono();

app.get('/', (c) => {
  return c.html(<FrontPage />);
});

app.get('/rgb-to-hex', rgbMiddleware, (c) => {
  const rgb = c.var.color;

  return c.json({
    hex: rgb.toHex()
  });
});

app.get('/hex-to-rgb', hexMiddleware, (c) => {
  const color = c.var.color;

  return c.json(color);
});

app.get('/preview', anyColorMiddleware, (c) => {
  const color = c.var.color;

  return c.html(
    <Page background={color}>
      <h1>Color Preview: {color.toHex()}, {JSON.stringify(color)}</h1>
    </Page>
  );
});

export default app;
