import Head from 'next/head'
import usePageTracker from '../hooks/usePageTracker';
import React from 'react';
import IntroPage from '../components/IntroPage'
import ContentPage from '../components/ContentPage'
import styled from 'styled-components';
import { get10MostViewed } from '@/models/pagesModel';

const MainDiv = styled.div`
  // display: flex;
  margin: 0;
  padding: 0;
  min-width: 100%;
  min-height: 100%;
  flex: row nowrap;
  justify-content: space-around;
  align-items: flex-start;
  overflow: hidden;
`

export default function Home({ mostViewed }) {
  usePageTracker()
  return (
    <MainDiv>
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
      <IntroPage mostViewed={mostViewed}/>
      <ContentPage />
    </MainDiv>
  )
}
export async function getStaticProps(context) {
  const mostViewed = await get10MostViewed();

  return {
    props: {
      mostViewed,
    },
    revalidate: 1,
  }
}
