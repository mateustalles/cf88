import { useState, useEffect } from 'react';
import { getAllPages } from '../../models/pagesModel';
import Table from 'react-bootstrap/Table';
import Head from 'next/head';


const ControlPanel = ({ data }) => {

  const sheets = [
    ['TESE SEM REPERCUSSÃO GERAL', 'teses-sem-repercussao-geral'],
    ['TESE COM REPERCUSSÃO GERAL', 'teses-com-repercussao-geral'],
    ['SÚMULA VINCULANTE', 'sumula-vinculante'],
    ['SÚMULA STJ', 'sumula-stj'],
    ['SÚMULA STF', 'sumula-stf'],
  ];

  const [filteredPages, setFilteredPages] = useState();
  const [filter, setFilter] = useState(sheets[0][1]);


  useEffect(() => {
    const filteredPages = data.filter((page) => Object.keys(page)[0] === filter);
    setFilteredPages(filteredPages);
    return () => setFilteredPages([]);
  }, [filter, setFilteredPages]);

  const pageHeaders = filteredPages && filteredPages[0][filter]['data']
  // const pageData = filteredPages && filteredPages.map((page) => ({
  //   page[filter]
  // }));
  return (
    <>
      <Head>
        <title>Painel Administrativo</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
          integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
          crossOrigin="anonymous"
        />
      </Head>
      <Table striped bordered hover>
        <thead>
          {pageHeaders && pageHeaders.map((page, index) => index === 0
            ? <th>Título</th> : <th>{Object.keys(page)}</th>)}
        </thead>
        <tbody>
          <tr>
            {/* {pageData && pageData.map()} */}
          </tr>
        </tbody>
      </Table>
    </>
  )
}

export async function getStaticProps() {
  const pages = await getAllPages();
  return {
    props: {
      data: pages,
    },
  }
}

export default ControlPanel;
