import Head from 'next/head'
import usePageTracker from '../hooks/usePageTracker';
import React from 'react';
import IntroPage from '../components/IntroPage'
import ContentPage from '../components/ContentPage'

export default function Home() {
  usePageTracker()
  return (
    <div className="container">
      <Head>
        <title>CF88 - Literalidades da Constituição Brasileira</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
          integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
          crossOrigin="anonymous"
        />
      </Head>
      <IntroPage />
      <ContentPage />
    </div>
  )
}
