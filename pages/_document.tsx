import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="stylesheet" href="/css/style.css" media="screen" />
        <script type="text/javascript" charSet="UTF-8" src="/js/vt.js"></script>
        <script type="text/javascript" charSet="UTF-8" src="/js/vt_1.js"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}