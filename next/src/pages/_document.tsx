// pages/_document.tsx
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document<{ lang?: string; dir?: string }> {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);

        // Example: SSR direction and language detection — you can make this smarter
        const lang = 'fa';
        const dir = lang === 'fa' ? 'rtl' : 'ltr';

        return {
            ...initialProps,
            lang,
            dir,
        };
    }

    render() {
        const dir = this.props?.dir || 'rtl';
        const lang = this.props?.lang || 'fa';

        return (
            <Html lang={lang} dir={dir}>
            <Head />
            <body>
            <Main />
            <NextScript />
            </body>
            </Html>
        );
    }
}

export default MyDocument;
