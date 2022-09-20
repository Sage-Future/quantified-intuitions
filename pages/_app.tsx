import "../styles/globals.css";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

import { Meta } from "../components/Meta";

import type { AppProps } from "next/app";
function MyApp({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>Pastcasting</title>
      </Head>
      <Meta />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
