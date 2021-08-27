import React, { useRef, useEffect, useContext, useState } from 'react';
import GenericPage from '../components/GenericPage';
import useWindowSize from '../hooks/useWindowsSize';
import { CF88Context } from '../context/CF88Context'
import styled from 'styled-components';
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios';

const ContentPageContainer = styled(GenericPage)`
  height: 100vh;
  width: 100vw;
  justify-content: space-between;
  position: relative;
  background: rgb(75,184,74);
`

const FormContainer = styled(Container)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 25px;
  border: 2px solid black;
  overflow-y: scroll;
  padding: 15px;
  overflow: hidden;
  color: white;

  h1 {
    color: white;
    padding: 25px;
  }
`

export default function ContentPage() {
  const { pageRefs: [, setPageRefs] } = useContext(CF88Context)
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const formHandler = async (e) => {
    e.preventDefault();
    await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/contact/send-message',
      data: {
        name, email, message
      }
    })
      .then((data) => console.log(data))
      .catch((err) => console.error(err))
  }

  const [, windowHeight] = useWindowSize();

  const contentRef = useRef();

  useEffect(() => {
    setPageRefs((refs) => ({ ...refs, contentRef }));

    return () => setPageRefs((refs) => {
      delete refs['contentRef']
      const newRefs = refs;
      return newRefs;
    });
  }, [setPageRefs]);


  return (
    <ContentPageContainer
      ref={contentRef}
      windowHeight={windowHeight}
      id="content"
    >
      <FormContainer>
        <h1>Fale conosco!</h1>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Nome</Form.Label>
            <Form.Control type="text" onChange={(e) => setName(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Mensagem</Form.Label>
            <Form.Control as="textarea" rows={3} onChange={(e) => setMessage(e.target.value)} />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            onClick={formHandler}
          >
            Enviar
          </Button>
        </Form>
      </FormContainer>
    </ContentPageContainer>
  )
}
