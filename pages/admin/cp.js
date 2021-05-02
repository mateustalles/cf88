/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { getAllPages } from '../../models/pagesModel';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Head from 'next/head';
import dynamic from 'next/dynamic'

const ControlPanelTable = dynamic(() => import('../../components/ControlPanelTable'))

const ControlPanel = ({ data }) => {
  const sheets = [
    ['TESE SEM REPERCUSSÃO GERAL', 'teses-sem-repercussao-geral'],
    ['TESE COM REPERCUSSÃO GERAL', 'teses-com-repercussao-geral'],
    ['SÚMULA VINCULANTE', 'sumula-vinculante'],
    ['SÚMULA STJ', 'sumula-stj'],
    ['SÚMULA STF', 'sumula-stf'],
  ];

  const [filter, setFilter] = useState(sheets[0][1]);

  const filterHandler = (e) => {
    const { target: { value } } = e;
    const filter = sheets.filter(([filter]) => filter === value);
    setFilter(filter[0][1]);
  }

  return (
    <Container>
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
      <Row>
        {/* <Col md={2}>
        </Col> */}
        <Col md={12}>
          <Row>
            <h1>Edição do banco de dados</h1>
          </Row>
          <Row>
            <Form.Group controlId="sheet-selection">
              <Form.Label>Planilha: </Form.Label>
              <Form.Control as="select" onChange={(e) => filterHandler(e)}>
                {sheets.map(([sheetTitle,]) => <option key={sheetTitle}>{sheetTitle}</option>)}
              </Form.Control>
              <Form.Text className="text-muted">
                Escolha a planilha a ser editada
              </Form.Text>
            </Form.Group>
          </Row>
          <Row>
            <ControlPanelTable data={data} filter={filter}/>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export async function getStaticProps() {
  const pages = await getAllPages();
  return {
    props: {
      data: pages,
    },
    revalidate: 1,
  }
}

export default ControlPanel;
