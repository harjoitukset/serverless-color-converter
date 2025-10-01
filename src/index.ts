import { Hono } from 'hono'
import {html} from 'hono/html';

const app = new Hono()

app.get('/rgb-to-hex', (c) => {
  const r = Number(c.req.query('r'))
  const g = Number(c.req.query('g'))
  const b = Number(c.req.query('b'))

  if (
    Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b) ||
    r < 0 || r > 255 ||
    g < 0 || g > 255 ||
    b < 0 || b > 255
  ) {
    return c.text('Invalid RGB values', 400)
  }

  const hex = '#' +
    r.toString(16).padStart(2, '0') +
    g.toString(16).padStart(2, '0') +
    b.toString(16).padStart(2, '0')

  return c.json({ hex: hex.toUpperCase() })
})

app.get('/hex-to-rgb', (c) => {
  const hex = c.req.query('hex')
  if (!hex || !/^#?[0-9a-fA-F]{6}$/.test(hex)) {
    return c.text('Invalid HEX value', 400)
  }

  const normalizedHex = hex.replace(/^#/, '')
  const r = parseInt(normalizedHex.slice(0, 2), 16)
  const g = parseInt(normalizedHex.slice(2, 4), 16)
  const b = parseInt(normalizedHex.slice(4, 6), 16)

  return c.json({ r, g, b })
})

app.get('/preview', (c) => {

  const h = c.req.query('hex')
  const r = Number(c.req.query('r'))
  const g = Number(c.req.query('g'))
  const b = Number(c.req.query('b'))


  if (!h &&
    (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b) ||
      r < 0 || r > 255 ||
      g < 0 || g > 255 ||
      b < 0 || b > 255
    )) {
    return c.text('Invalid RGB values', 400)
  }

  const hex = h || '#' +
    r.toString(16).padStart(2, '0') +
    g.toString(16).padStart(2, '0') +
    b.toString(16).padStart(2, '0')

  const x = html`
    <html>
      <body style="background-color:${hex};">
      </body>
    </html>
  `
  return c.html(x)
})

export default app
