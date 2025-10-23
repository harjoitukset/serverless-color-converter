# Serverless Color Converter

Tässä tehtävässä opit hyödyntämään [Hono-sovelluskehystä](http://hono.dev/) ja toteuttamaan funktioita, jotka käsittelevät HTTP-pyyntöjä ja -vastauksia, mutta jotka eivät ole riippuvaisia tietystä palvelinympäristöstä.

Palvelinprosessin sijasta serverless-sovellukset, kuten Hono, toimivat tapahtumapohjaisesti, jolloin koodi suoritetaan vain, kun tietty tapahtuma, kuten HTTP-pyyntö, laukaisee sen.

Suurimmilla palveluntarjoajilla, kuten AWS, Google ja Microsoft, on omat serverless-alustansa, joissa jokaisella on omat kirjastonsa ja työkalunsa. Hono on suunniteltu toimimaan useissa eri ympäristöissä, joten tämän harjoituksen menetelmät ja työkalut ovat sovellettavissa laajemmin kuin vain yhden palveluntarjoajan ekosysteemiin.

Harjoituksessa käytämme Node.js:ää ja npm:ää, jotka sinulla tulee olla valmiiksi asennettuina.


## Tehtävän suorittaminen

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

Luo tähän repositorioon uusi Hono-projekti seuraamalla [Honon Getting Started -ohjeita](https://hono.dev/docs/getting-started/basic). Toisin kuin ohjeissa, luo projektisi oman repositoriosi juureen, älä erilliseen kansioon:

```bash
npm create hono@latest .
```

Valitse pohjaksi (template) `cloudflare-workers`<sup>1</sup> ja paketinhallinnaksi `npm`. Luontityökalu luo sinulle tarvitsemasi tiedostot ja kansiot ja varmistaa lisäksi, että haluat luoda projektin nykyiseen kansioon, joka ei ole tyhjä. Jos luot epähuomiossa projektin väärään paikkaan, voit siirtää luodut tiedostot ja kansiot manuaalisesti projektin juureen.

> [!NOTE]
> <sup>1</sup> Alustariippumattomuudesta huolimatta esimerkin vuoksi tarvitsemme jonkin kohdeympäristön, joka tässä tapauksessa on [Cloudflare Workers](https://workers.cloudflare.com/). Cloudflare Workers on serverless-alusta, joka mahdollistaa JavaScriptin ja muiden kielten suorittamisen "reunalla" (edge), eli lähellä käyttäjää, mikä parantaa suorituskykyä ja vähentää latenssia.
>
> Sinun ei tarvitse rekisteröityä Cloudflareen tai luoda tiliä, koska sovellusta kokeillaan ja testataan paikallisesti. Jos haluat, voit jatkaa tehtävän parissa ja julkaista sovelluksesi Cloudflaren Workers-alustalle itsenäisesti.


**Asennus ja käynnistys**

Projektin luonnin yhteydessä [`create-hono`-työkalu](https://www.npmjs.com/package/create-hono) luo uuden `README.md`-tiedoston, joka sisältää lisää ohjeita projektin asentamiseksi ja käynnistämiseksi. Samat ohjeet löytyvät myös Getting Started -sivulta.

Asenna tarvittaessa riippuvuudet, käynnistä kehityspalvelin edellä mainittujen lähteiden mukaan ja varmista, että sovelluksesi vastaa selaimen pyyntöön osoitteessa `http://localhost:8787`.


**Hakemistorakenne**

Tehtävän automaattiset testit on määritetty testaamaan `src/index.ts`-tiedostossa olevia funktioita, joten toteuta varsinainen sovellus kyseiseen tiedostoon.

Voit lisäksi luoda muita tiedostoja ja kansioita tarpeen mukaan, mutta varmista, että Hono-sovellus on lopulta `src/index.ts`-tiedostossa "default export", jotta automaattiset testit löytävät funktiosi.


### Funktio 1: RGB → HEX -muunnin (25 %)

Kun olet saanut projektin luotua ja käynnistettyä, voit alkaa toteuttaa ensimmäistä funktiota, joka muuntaa RGB-värit HEX-muotoon.

Funktio tulee toteuttaa siten, että se kuuntelee HTTP GET -pyyntöjä polussa `/rgb-to-hex`. Funktio odottaa saavansa kolme kyselyparametria: `r`, `g` ja `b`, jotka edustavat punaisen, vihreän ja sinisen komponenttien arvoja. Jokaisen arvon tulee olla kokonaisluku välillä 0–255.

Pyynnön käsittelystä kerrotaan lyhyesti Getting Started -sivulla, mutta tarkemmat tiedot löydät [`HonoRequest`-dokumentista](https://hono.dev/docs/api/request).

Esimerkiksi pyyntöön `http://localhost:8787/rgb-to-hex?r=64&g=224&b=208` funktiosi tulee palauttaa vastaus, joka sisältää HEX-muodossa olevan värin `#40E0D0` (turkoosi). Värikoodi tulee palauttaa joko tekstinä tai JSON-muodossa, oman valintasi mukaan. Esitä HEX-arvot aina isoilla kirjaimilla.

> [!TIP]
> Huomaa, että kyselyparametrit ovat aina merkkijonoja, joten ne on syytä muuntaa kokonaisluvuiksi ennen kuin käytät niitä laskuissa.


### Funktio 2: HEX → RGB -muunnin (25 %)

Toinen funktio tulee toteuttaa siten, että se kuuntelee HTTP GET -pyyntöjä polussa `/hex-to-rgb`. Funktio odottaa saavansa yhden kyselyparametrin: `hex`, joka edustaa HEX-värin arvoa muodossa `#RRGGBB`, jossa `RR`, `GG` ja `BB` ovat heksadesimaalilukuja välillä `00`-`FF`.

Esimerkiksi pyyntöön `http://localhost:8787/hex-to-rgb?hex=%23FA8072` tulee vastata JSON-objektilla, joka sisältää annettua väriä (Salmon) vastaavat RGB-komponentit:

```json
{ "r": 250, "g": 128, "b": 114 }
```

Vastaus voidaan antaa JSON-muodossa hyödyntäen Honon `Context`-olion `json`-metodia, josta kerrotaan tarkemmin [Context-dokumentissa](https://hono.dev/docs/api/context#json).

> [!TIP]
> Muista, että URL-osoitteessa `#`-merkki tulee koodata muodossa `%23`, jotta selain ei tulkitse sitä "ankkuriksi", eli sivun sisäiseksi linkiksi.


### Funktio 3: värin esikatselu (25 %)

Tehtävän viimeisen funktion tulee kuunnella HTTP GET -pyyntöjä polussa `/preview`. Funktio odottaa saavansa joko kolme kyselyparametria: `r`, `g` ja `b`, tai yhden kyselyparametrin: `hex`.

Funktion tulee palauttaa vastauksena HTML-sivu, joka saa olla muuten tyhjä, mutta jonka taustaväri on määritetty saatujen parametrien perusteella. Taustaväri voidaan määritellä joko erillisessä CSS-tyylissä tai suoraan HTML-elementin `style`-attribuutissa. Voit halutessasi lisätä sivulle myös muita elementtejä, kuten otsikon tai värikoodin tekstinä.

Esimerkiksi seuraavien pyyntöjen tulee molempien palauttaa HTML-sivu, jonka taustaväri on "hot pink":

- `http://localhost:8787/preview?r=255&g=105&b=180`
- `http://localhost:8787/preview?hex=%23FF69B4`

HTML-sisällön palauttamisessa voidaan käyttää Honon `Context`-olion `html`-metodia, josta kerrotaan tarkemmin [Context-dokumentissa](https://hono.dev/docs/api/context#html).

> [!WARNING]
> Käyttäjältä saadut arvot tulee aina tarkistaa ennen niiden käyttöä, jotta vältetään mahdolliset [XSS-hyökkäykset (Cross-Site Scripting)](https://owasp.org/www-community/attacks/xss). Jos laitat käyttäjän syöttämät arvot suoraan HTML:ään ilman tarkistusta, saattaa hyökkääjä pystyä muotoilemaan syötteensä siten, että se suoritetaan osana HTML-sivua.
>
> Jos käyttäjä syöttää esimerkiksi tekstin `<script>alert('Hacked!');</script>` HEX-parametrina, ja et tarkista tätä arvoa, se voi johtaa haitallisen JavaScript-koodin suorittamiseen sivulla. Tyypilliset XSS-hyökkäykset vuotavat tietoja, kuten evästeitä tai kirjautumistietoja, mikäli hyökkääjä onnistuu saamaan uhrin avaamaan sivun linkillä, jossa on mukana haitallista koodia.
>
> Hono tarjoaa erilaisia keinoja suojautua XSS-hyökkäyksiltä, kuten [html Helperin](https://hono.dev/docs/helpers/html#html-helper), joka voi olla avuksi. Voit myös käyttää HTML-rakenteen muodostamisessa Reactista tuttua JSX-syntaksia, jonka avulla merkkijonot käsitellään turvallisesti. JSX:n käytöstä on [oma erillinen ohjesivunsa Honon dokumentaatiossa](https://hono.dev/docs/guides/jsx), josta löydät tärkeimmät ohjeet. Jos käytät JSX:ää, muista vaihtaa tiedostopääte `.ts` → `.tsx` sekä päivitä `wrangler.jsonc`-tiedoston `main`-kenttä vastaamaan uutta tiedostopäätettä.
>
> Vaihtoehtoisesti voit käyttää myös muita keinoja, kuten säännöllisiä lausekkeita, enkoodausta tai kolmannen osapuolen kirjastoja syötteiden tarkistamiseen.


### Laadulliset vaatimukset (25 %)

Kaikkien funktioiden tulee tarkistaa, että saatuja parametreja on oikea määrä ja että niiden arvot ovat sallituissa rajoissa. Jos parametrit puuttuvat tai niiden arvot ovat virheellisiä, tulee funktioiden palauttaa HTTP-vastaus, jossa on virhekoodi 400 (Bad Request) ja kuvaava virheilmoitus.

Lisäksi koodisi ei saa sisältää TypeScript- tai linter-virheitä.


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
