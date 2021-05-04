/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useCurrentUser } from '@/hooks/index';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Head from 'next/head';
import dynamic from 'next/dynamic'

const ConfirmationModal = (props) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Aviso</h4>
        <p>
          Os dados excluídos só poderão ser resgatados através de backup.
          Se você ainda não fez, realize agora e só depois prossiga com a exclusão.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          variant="danger"
          onClick={() => props.requestHandler(props.fetchType)}
        >
          Restaurar
        </Button>
        <Button type="button" variant="secondary" onClick={props.onHide}>Cancelar</Button>
      </Modal.Footer>
    </Modal>
  );
}

const Navbar = dynamic(() => import('@/components/Navbar'))

const Settings = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [fetchType, setFetchType] = useState('original');

  const router = useRouter();
  const [user] = useCurrentUser();

  useEffect(() => {
    if (!user || user.role !== 'admin') return router.push('/login');
  }, [user, router]);


  const requestHandler = async (action) => {
    if (action === 'original') {
      await fetch(`/api/update-stf`, {
        method: 'GET',
      })
        .then((res) => {
          if (res.ok) router.reload();
        })
        .catch((err) => {
          throw new Error(err);
        });
    } else if (action === 'backup') {
      await fetch(`/api/update-backup`, {
        method: 'GET',
      })
        .then((res) => {
          if (res.ok) router.reload();
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
  }

  const buttonHandler = (title, fetchType) => {
    setFetchType(fetchType);
    setModalTitle(title);
    setShowModal(true);
  }

  return (
    <>
      <Head>
        <title>Configurações</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
          integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
          crossOrigin="anonymous"
        />
      </Head>
      <ConfirmationModal
        show={showModal}
        requestHandler={requestHandler}
        onHide={() => setShowModal(false)}
        title={modalTitle}
        fetchType={fetchType}
      />

      <Container fluid="lg">
        <Row>
          <Navbar />
        </Row>
        <ListGroup variant="flush" lg={12}>
          <ListGroup.Item >
            <Row>
              <Col lg={8}>
                Restaurar banco de dados a partir de tabela padrão:
              </Col>
              <Col lg={4}>
                <Button
                  variant="outline-dark"
                  type="button"
                  onClick={() => buttonHandler('Restaurar dados do original', 'original')}
                >
                  Restaurar Original
                </Button>
              </Col>
            </Row>
            <Row>
              <Col lg={8}>
                Restaurar banco de dados a partir de tabela backup:
              </Col>
              <Col lg={4}>
                <Button
                  variant="outline-dark"
                  type="button"
                  onClick={() => buttonHandler('Restaurar dados do backup', 'backup')}
                >
                  Restaurar Backup
                </Button>
              </Col>
            </Row>
          </ListGroup.Item>
        </ListGroup>
      </Container>
    </>
  )
}


export default Settings;
