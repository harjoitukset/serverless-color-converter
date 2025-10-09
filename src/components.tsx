import { HEX } from "./types";

export function FrontPage() {
    return (
        <Page>
            <h1>Color Converter app</h1>
            <ul>
                <li>
                    <a href="/hex-to-rgb?hex=%23C0FFEE">Convert HEX to RGB</a> (try with <code>?hex=#C0FFEE</code>)
                </li>
                <li>
                    <a href="/rgb-to-hex?r=176&g=0&b=181">Convert RGB to HEX</a> (try with <code>?r=176&amp;g=0&amp;b=181</code>)
                </li>
                <li>
                    <a href="/preview?hex=%23BADA55">Preview color from HEX</a> (try with <code>?hex=#BADA55</code>)<br />
                </li>
            </ul>
        </Page>
    );
}

export function Page({ children, background }: { children: any, background?: HEX }) {
    return (
        <html>
            <body style={{ backgroundColor: background || '#fff', fontFamily: 'sans-serif', padding: '1rem' }} >
                {children}
            </body>
        </html>
    );
}
