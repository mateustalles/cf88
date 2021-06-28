/* eslint-disable react/prop-types */
import React, { useRouter, useState } from 'next/router'
import { findPage, getAllPages } from '../../../models/pagesModel';
import '../../../styles/Verbatim.module.css'
import Head from 'next/head';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Verbatim = ({ page }) => {
  const [showLeadModal, setShowLeadModal] = useState(true);
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
    <Container className="verbatim">
      <Head>
        <title>{`${sheetTitle} - ${pageTitle}`}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={content} />
      </Head>
      <Row>
        <h1>{sheetTitle}: {pageTitle}</h1>
      </Row>
      <Row>
        <Col>
          { pageData.map((entry, index) => {
            const [[title, value]] = Object.entries(entry);
            if (index === 0) return (
              <Row>
                <h3 key="value">{value}</h3>
              </Row>
            );
            else if (index === data.length - 1) return;
            return (
              <Row key={`${title}_${value}`}>
                <p>{title.toUpperCase() + ':'} {value}</p>
              </Row>
            )
          }) }
        </Col>
      </Row>
    </Container>
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
