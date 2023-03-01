import "../styles/globals.css";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import NextNProgress from 'nextjs-progressbar';

import { Meta } from "../components/Meta";

import type { AppProps } from "next/app";
import { GoogleAnalytics } from "nextjs-google-analytics";
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
      <GoogleAnalytics trackPageViews />
      <NextNProgress color="#4f46e5" showOnShallow={true} height={2} options={{ trickle: true, showSpinner: false }} />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
