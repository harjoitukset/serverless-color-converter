# Serverless Color Converter mmuntaminen API

Tässä projektissa laajennamme alkuperäistä serverless-color-converter-tehtävää lisäämällä siihen Zod OpenAPI -tuen, joka mahdollistaa vahvan tyypityksen ja automaattisen OpenAPI-dokumentaation luomisen.

### Kansiorakenne

```
serverless-color-converter/
├── node_modules/
├── src/
│   ├── index.ts        # Pääsovelluksen logiikka
│   ├── schemas.ts      # Zod-skeemat
│   └── openapi.ts      # OpenAPI-konfiguraatio
├── package.json        # Projektin riippuvuudet
├── tsconfig.json       # TypeScript-konfiguraatio
└── wrangler.toml       # Cloudflare Workers -konfiguraatio
```


## Tehtävän suorittaminen

Lisää seuraavat riippuvuudet projektiin:

   ```bash
   npm install zod @hono/zod-openapi
   ```

   Tämä asentaa Zod-kirjaston skeemojen määrittämiseen ja `@hono/zod-openapi`-middleware:n, joka mahdollistaa OpenAPI-dokumentaation luomisen.

---

Chanfana(https://chanfana.pages.dev/) on kirjasto, joka lisää OpenAPI 3 ja 3.1 -määrittelyt Hono-sovelluksiin. Se mahdollistaa automaattisen dokumentaation luomisen ja pyynnön validoinnin TypeScriptin avulla.

### Asennus

Asenna Chanfana ja tarvittavat riippuvuudet:

```bash
npm install chanfana @hono/standard-validator zod
```
Luo `src/index.ts`-tiedostoon seuraava koodi:

```typescript
import { Hono } from 'hono'
import { fromHono } from 'chanfana'
import { z } from 'zod'

const app = new Hono()

// Määrittele Zod-skeema
const rgbSchema = z.object({
  r: z.number().min(0).max(255),
  g: z.number().min(0).max(255),
  b: z.number().min(0).max(255),
})

// Lisää Chanfana OpenAPI-tuki
const openApi = fromHono(app, {
  title: 'Värimuunnin API',
  version: '1.0.0',
  description: 'API väreille HEX ja RGB muunnoksille',
  schemas: {
    RGB: rgbSchema,
  },
})

// Lisää reitit
app.get('/rgb-to-hex', (c) => {
  const { r, g, b } = c.req.query()
  const hex = `#${(+r).toString(16).padStart(2, '0').toUpperCase()}${(+g).toString(16).padStart(2, '0').toUpperCase()}${(+b).toString(16).padStart(2, '0').toUpperCase()}`
  return c.json({ hex })
})

export default openApi
```

## Toiminnalliset vaatimukset

Chanfana luo automaattisesti OpenAPI-dokumentaation määrittelemistäsi reiteistä ja skeemoista. Voit tarkastella tätä dokumentaatiota esimerkiksi käyttämällä [Swagger UI:tä](https://swagger.io/tools/swagger-ui/).

Dokumentaatio sisältää tiedot pyynnön parametreista, vastausmuodoista ja mahdollisista virhetilanteista.
Zod on kirjasto joka tarjoaa vahvan tyypityksen ja validoinnin TypeScriptissä. Chanfana toimii Zod:in kanssa jolloin voit määritellä skeemat ja validoida pyynnöt ennen niiden käsittelyä.

Esimerkiksi yllä olevassa esimerkissä `rgbSchema` määrittelee, että `r`, `g` ja `b` -parametrien tulee olla lukuja välillä 0–255. Jos nämä ehdot eivät täyty, pyyntö hylätään automaattisesti.

### Projektin luominen

* OpenAPI-dokumentaatio Chanfanan avulla
* Pyynnön validointi Zodilla
* Testaus Vitestillä
* Useita reittejä väreille HEX ja RGB muunnoksille

**OpenAPI-dokumentaation luominen**
`src/openapi.ts`-tiedostossa määritämme OpenAPI-dokumentaation, joka kuvaa API:n rakenteen ja käytettävät reitit. Esimerkiksi:

```typescript
import { OpenAPIHono } from '@hono/zod-openapi';
import { app } from './index';

const openApiApp = new OpenAPIHono(app);

openApiApp.doc('/openapi.json', {
  openapi: '3.1.0',
  info: {
    title: 'Värimuunnos API',
    version: '1.0.0',
    description: 'API väriarvojen muuntamiseen RGB:n ja HEX:n välillä.',
  },
});

export default openApiApp;
```

Tämä määrittää OpenAPI-dokumentaation reitin `/openapi.json`, jonka avulla käyttäjät voivat tutustua API:n rakenteeseen ja käyttää sitä esimerkiksi automaattisesti luotavien asiakasohjelmien avulla.

Asenna tarvittaessa riippuvuudet, käynnistä kehityspalvelin edellä mainittujen lähteiden mukaan ja varmista, että sovelluksesi vastaa selaimen pyyntöön osoitteessa `http://localhost:8787`.


Julkaisu

Projektin voi julkaista Cloudflare Workers -alustalle seuraavasti:

1. **Wranglerin asentaminen**:

   ```bash
   npm install -g wrangler
   ```

2. **Projektin konfigurointi**:

   ```bash
   wrangler init
   ```

   Seuraa ohjeita ja määritä projekti Cloudflare Workers -ympäristölle.

3. **Julkaisun suorittaminen**:

   ```bash
   wrangler publish
   ```

Tämä julkaisee sovelluksen Cloudflare Workers -alustalle, jolloin se on käytettävissä globaalisti.

### Ratkaisujen testaaminen

Ratkaisusi testataan automaattisesti [Vitest-työkalun avulla](https://vitest.dev/). Testit on määritelty valmiiksi `tests`-kansiossa, ja ne tarkistavat, että funktiosi toimivat vaatimusten mukaisesti.

Asenna `vitest`-työkalu projektisi kehitysriippuvuuksiin komennolla:

```bash
npm install --save-dev vitest
```

Tämän jälkeen voit testata itse ratkaisusi komennoilla:

```bash
# tehtävän vaiheet 1-3:
npx vitest run tests/rgbToHex.test.ts
npx vitest run tests/hexToRgb.test.ts
npx vitest run tests/preview.test.ts

# lisäksi testataan virhetilanteet:
npx vitest run tests/errorHandling.test.ts

# jos haluat, voit ajaa kaikki testit kerralla:
npx vitest run
```

## Ratkaisun lähettäminen GitHubiin

Tarkista, että olet lisännyt tekemäsi muutokset versionhallintaan ja tee commit. Lopuksi pushaa tekemäsi muutokset GitHubiin tarkastettavaksi. GitHub actions -työkalu tarkistaa automaattisesti, menevätkö testit läpi, ja näet tulokset GitHubin käyttöliittymästä actions-välilehdeltä.

Voit lähettää ratkaisusi uudestaan niin monesti kuin haluat tehtävän määräaikaan asti. Viimeisimmän arvioinnin pisteet jäävät voimaan.


## Tietoa harjoituksesta

Tämän tehtävän on kehittänyt Teemu Havulinna ja Ismo Harjunmaa ja se on lisensoitu [Creative Commons BY-NC-SA -lisenssillä](https://creativecommons.org/licenses/by-nc-sa/4.0/).

Tehtävänannon, lähdekoodien ja testien toteutuksessa on hyödynnetty ChatGPT-kielimallia sekä GitHub copilot -tekoälyavustinta.
