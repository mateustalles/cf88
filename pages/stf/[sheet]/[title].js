/* eslint-disable react/prop-types */
import React, { useRouter } from 'next/router'
import { findPage, getAllPages } from '../../../models/pagesModel';
import '../../../styles/Verbatim.module.css'
import Head from 'next/head';

const Verbatim = ({ page }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>
  }

  const { sheet } = router.query;

  const { sheetTitle } = page[sheet];
  const sheetData = page[sheet]['data'];
  const [{ pageTitle }, ...data ] = sheetData;
  const pageData = Object.values(data);
  const content = Object.entries(pageData[0])[0][1].replace(/\n/g, ' ');
  return (
    <div className="verbatim">
      <Head>
        <title>{`${sheetTitle} - ${pageTitle}`}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={content} />
      </Head>
      <h1>{sheetTitle}: {pageTitle}</h1>
      { pageData.map((entry, index) => {
        const [[title, value]] = Object.entries(entry);
        if (index === 0) return <h3 key="value">{value}</h3>;
        else if (index === data.length - 1) return;
        return <p key={`${title}_${value}`}>{title.toUpperCase() + ':'} {value}</p>;
      }) }
    </div>
  )
}

export async function getStaticPaths() {
  const rawData = await getAllPages();
  const paths = rawData.map((page) => {
    const sheetSlug = Object.keys(page)[0];
    return {
      params: { sheet: sheetSlug, title: page[sheetSlug].pageSlug }
    };
  });

  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps(context) {
  const { params: { sheet, title } } = context;

  const page = await findPage(sheet, title);

  return {
    props: {
      page,
    },
    revalidate: 1,
  }
}

export default Verbatim;
