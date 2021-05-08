/* eslint-disable react/prop-types */
import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { CF88Context } from '@/context/CF88Context'
import 'bootstrap/dist/css/bootstrap.min.css';

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
          Confirmação de Backup
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Backup</h4>
        <p>
          O banco de dados atual foi salvo na pasta CMS do GoogleDrive.
          <br /><br />
          Nome do arquivo: {props.fileName}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="primary" onClick={() => props.router.replace('/admin/cp')}>Voltar</Button>
      </Modal.Footer>
    </Modal>
  );
}

const OAuth2 = ({ code }) => {
  const { gOAuth2: [
      oAuth2Token, setOAuth2Token,
    ] } = useContext(CF88Context);
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const fetchRequest = async() => {
      await axios.post('/api/google-auth', {
        code: code,
      },{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }})
        .then(async () => {
          await axios.get('/api/fetch-xlsx')
            .then(({ data }) => {
              setShowModal(true);
              setFileName(data)
            })
            .catch((err) => {
              console.error(err.message);
            })
        })
        .catch((err) => {
          throw new Error(err);
        })
    }
    code && fetchRequest();
  }, [code])

  return (
    <>
      <ConfirmationModal
        show={showModal}
        fileName={fileName}
        onHide={() => setShowModal(false)}
        router={router}
      />
      Aguarde...
    </>
  );
};

export async function getServerSideProps(context) {
  const { query } = context;
  const code = query.code

  return {
    props: {code}
  }
}

export default OAuth2;
