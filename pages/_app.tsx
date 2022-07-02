import "../styles/globals.css";

import { SessionProvider } from "next-auth/react";
import Head from "next/head";

import type { AppProps } from "next/app";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>Pastcasting</title>
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
