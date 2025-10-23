import { ApiException, fromHono } from "chanfana";
import { Hono } from 'hono';
import { ContentfulStatusCode } from "hono/utils/http-status";
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

const openapi = fromHono(app, {
	docs_url: "/api",
	schema: {
		info: {
			title: "Color converter API",
			version: "1.0.0",
			description: "This is doecumentation of Color converter API.",
		},
	},
});

//openapi.route("/colors", apiRouter);

app.onError((err, c) => {
	if (err instanceof ApiException) {
		return c.json(
			{ success: false, errors: err.buildResponse() },
			err.status as ContentfulStatusCode,
		);
	}

	console.error("Global error handler caught:", err);
	return c.json(
		{
			success: false,
			errors: [{ code: 7000, message: "Internal Server Error" }],
		},
		500,
	);
});

export default app;
