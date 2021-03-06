/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { findPage, getAllPages } from '@/models/pagesModel';
import axios from 'axios';
import '@/styles/Verbatim.module.css'
import Head from 'next/head';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import styled from 'styled-components';

const ConfirmationToast = (props) => {
  const [show, setShow] = useState(false);

  return (
    <Row>
      <Col xs={6}>
        <Toast
          onClose={() => setShow(false)}
          show={show || props.displayConfirmation}
          delay={3000}
          bg="info"
          autohide
        >
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Pronto!</strong>
          </Toast.Header>
          <Toast.Body>Seu contato está salvo!</Toast.Body>
        </Toast>
      </Col>
    </Row>
  );
}


const LeadModal = (props) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === '' || name === '') {
      return
    }
    props.requestHandler(name, email)
      .then(() => setIsDone(true));
    
    setTimeout(() => {
      props.setShowLeadModal(false)
    }, 1500)
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      {isDone 
      ? <div>
          <Modal.Body>
            <h1>Obrigado</h1>
          </Modal.Body>
        </div>
      :
      <div>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Bem vindo à Literalidades da CF-88!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Quem somos?</h4>
          <p>
            {`Nosso intuito é ser a referência para você no estudo da Constituição Federal de 1988 para concursos!
            Que receber nossas novidades quando novos artigos forem adicionados, ganhar descontos e acesso exclusivos
            e aprimorar seus estudos online? 

            Então cadastre seu e-mail e senha logo abaixo!
            `}
          </p>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Nome:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nome"
                maxLength={120}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
          >
            Enviar
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={props.onHide}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </div>
    }
    </Modal>
  )
};

const StyledRow = styled.div`
  background-color: rgba(0, 128, 0, 0.3);
`
const Verbatim = ({ page, pageRef }) => {
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);

  useEffect(() => {
    const { sheetSlug, pageSlug } = pageRef
    const incrementViews = async() => {
      await axios({
        method: 'POST',
        url: '/api/page/increment-views',
        data: {
          sheetSlug, pageSlug
        }
      }).then((response) => console.log(response.data))
      .catch((err) => console.error(err))
    }
    incrementViews()
    setShowLeadModal(true)
  }, [pageRef]);

  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>
  }

  const requestHandler = async (name, email) => {
    //useAPI
    await axios({
      method: 'POST',
      url: '/api/user/add-new-lead',
      data: {
        name, email
      }
    }).then((response) => console.log(response.data))
    .catch((err) => console.error(err))
  }

  const { sheet } = router.query;

  const { sheetTitle } = page[sheet];
  const sheetData = page[sheet]['data'];
  const [{ pageTitle }, ...data ] = sheetData;
  const pageData = Object.values(data);
  const content = Object.entries(pageData[0])[0][1].replace(/\n/g, ' ');
  return (
      <>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
            integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
            crossOrigin="anonymous"
          />
          <meta name='description' content={content} />
        </Head>
        <ConfirmationToast
          displayConfirmation={displayConfirmation}
        />
        <LeadModal
          show={showLeadModal}
          requestHandler={requestHandler}
          setShowLeadModal={setShowLeadModal}
          onHide={() => setShowLeadModal(false)}
        />
      <Container className="verbatim">
          <StyledRow>{`${sheetTitle} - ${pageTitle}`}</StyledRow>
        <Row>
          <h1>{sheetTitle}: {pageTitle}</h1>
        </Row>
        <Row>
          <Col>
            { pageData.map((entry, index) => {
              const [[title, value]] = Object.entries(entry);
              if (index === 0) return (
                <Row key={`${title}_${value}`}>
                  <h2 key="value">{value}</h2>
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
    </>
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
      pageRef: {
        sheetSlug: sheet,
        pageSlug: title
      }
    },
    revalidate: 1,
  }
}

export default Verbatim;
