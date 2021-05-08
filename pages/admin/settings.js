/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useCurrentUser } from '@/hooks/index';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Head from 'next/head';
import dynamic from 'next/dynamic'
import axios from 'axios';

const RestoreModal = (props) => {
  const [sheetId, setSheetId] = useState('');

  const handleSubmit = () => {
    if (sheetId === '') {
      return
    }

    return props.requestHandler('restore', sheetId);
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Restaurar backup
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Aviso</h4>
        <p>
          Para realizar a restauração, é necessário inserir o ID do arquivo no Google Drive.
        </p>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>ID do arquivo:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Id do arquivo no Google Drive"
              onChange={(e) => setSheetId(e.target.value)}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          variant="danger"
          onClick={handleSubmit}
        >
          Restaurar
        </Button>
        <Button type="button" variant="secondary" onClick={props.onHide}>Cancelar</Button>
      </Modal.Footer>
    </Modal>
  );
}

const SaveBackupModal = (props) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Salvar Backup
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Aviso</h4>
        <p>
          Deseja salvar o atual banco de dados em um arquivo XLSX (backup)?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          variant="danger"
          onClick={() => props.requestHandler('backup')}
        >
          Salvar
        </Button>
        <Button type="button" variant="secondary" onClick={props.onHide}>Cancelar</Button>
      </Modal.Footer>
    </Modal>
  );
}

const Navbar = dynamic(() => import('@/components/Navbar'))

const Settings = () => {
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const router = useRouter();
  const [user] = useCurrentUser();

  useEffect(() => {
    if (!user || user.role !== 'admin') return router.push('/login');
  }, [user, router]);


  const requestHandler = async (action, sheetId='') => {
    if (action === 'restore') {
      await axios.post(`/api/update-stf`, {
        sheetId
      })
        .then(() => {
          router.reload();
        })
        .catch((err) => {
          console.error(err.message)
        });
    } else if (action === 'backup') {
      await axios.get(`/api/google-auth`)
        .then(({ data }) => {
          router.replace(data);
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
  }

  const buttonHandler = (fetchType) => {
    fetchType === 'restore' ? setShowRestoreModal(true) : setShowBackupModal(true);
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

      <SaveBackupModal
        show={showBackupModal}
        requestHandler={requestHandler}
        onHide={() => setShowBackupModal(false)}
      />

      <RestoreModal
        show={showRestoreModal}
        requestHandler={requestHandler}
        onHide={() => setShowRestoreModal(false)}
      />

      <Container fluid="lg">
        <Row>
          <Navbar />
        </Row>
        <ListGroup variant="flush" lg={12}>
          <ListGroup.Item >
            <Row>
              <Col lg={8}>
                Salvar banco de dados em XLSX (backup)
              </Col>
              <Col lg={4}>
                <Button
                  variant="outline-dark"
                  type="button"
                  onClick={() => buttonHandler('backup')}
                >
                  Salvar Backup
                </Button>
              </Col>
            </Row>
            <Row>
              <Col lg={8}>
                Restaurar banco de dados a partir de tabela:
              </Col>
              <Col lg={4}>
                <Button
                  variant="outline-dark"
                  type="button"
                  onClick={() => buttonHandler('restore')}
                >
                  Restaurar banco de dados
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
