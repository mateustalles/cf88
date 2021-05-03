/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import { getAllPages } from '../../models/pagesModel';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Head from 'next/head';
import dynamic from 'next/dynamic'
import { CF88Context } from '../../context/CF88Context'

const ControlPanelTable = dynamic(() => import('../../components/ControlPanelTable'))

const ControlPanel = ({ data }) => {
  const sheets = [
    ['TESE SEM REPERCUSSÃO GERAL', 'teses-sem-repercussao-geral'],
    ['TESE COM REPERCUSSÃO GERAL', 'teses-com-repercussao-geral'],
    ['SÚMULA VINCULANTE', 'sumula-vinculante'],
    ['SÚMULA STJ', 'sumula-stj'],
    ['SÚMULA STF', 'sumula-stf'],
  ];
  const { editionModal:
          [
            [, setDisplayModal],
            [,],
            [, setModalHeaders],
            [, setModalType]
          ],
          cpTable: [ sheet, setSheet ] } = useContext(CF88Context);

  const filterHandler = (e) => {
    const { target: { value } } = e;
    const filter = sheets.filter(([filter]) => filter === value);
    setSheet(filter[0][1]);
  }

  const buttonHandler = () => {
    const modalHeaders = sheet && data && data[0][sheet] && data[0][sheet]['data'];
    setModalType('blank');
    setModalHeaders(modalHeaders);
    setTimeout(() => setDisplayModal(true), 300);
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
        <Col lg={12}>
          <Row>
            <h1>Edição do banco de dados</h1>
          </Row>
          <Row>
            <Form lg={12}>
              <Form.Row>
                <Col lg={12}>
                  <Form.Group controlId="sheet-selection">
                    <Form.Label>Planilha: </Form.Label>
                    <Form.Control as="select" onChange={(e) => filterHandler(e)}>
                      {sheets.map(([sheetTitle,]) => <option key={sheetTitle}>{sheetTitle}</option>)}
                    </Form.Control>
                    <Form.Text className="text-muted">
                      Escolha a planilha a ser editada
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col lg={12}>
                  <Form.Group>
                    <Button onClick={buttonHandler}variant="outline-primary">Criar novo</Button>
                  </Form.Group>
                </Col>
              </Form.Row>
            </Form>
          </Row>
          <Row>
            <ControlPanelTable data={data} />
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
