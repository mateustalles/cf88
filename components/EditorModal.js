/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useEffect, useState, useRef, forwardRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

const EditorModal = forwardRef(({ data, sheetSlug, headers, showModal, handleClose, type='update' }, ref) => {
  const [validated, setValidated] = useState(false);
  const [pageData, setPageData] = useState({});

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    console.log(pageData);
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };

  const formData = useRef();

  useEffect(() => {
    const pageData = {};
    const generateFields = () => {
      const source = type === 'blank' ? headers : data;
      return source && source.map((set) => Object.entries(set).map(([key, value]) => {
        Object.assign(pageData, { [key]: value });
        if (key === 'pageTitle') return ['Título', value, 'text'];
        if (value.length > 30) return [key, value, 'textarea'];
        if (value.match(/^\d+\/\d+\/\d+$/gi)) {
          let date = value.split('/');
          if(date[0].length === 1) date[0] = '0' + date[0];
          if(date[1].length === 1) date[1] = '0' + date[1];
          const newDate = [date[2], date[1], date[0]].join('-');
          return [key, newDate, 'date'];
        }
        return [key, value, 'text'];
      }));
    }

    formData.current = generateFields();
    setPageData(pageData);
  }, [data, headers, type]);

  const formRef = useRef([]);

  const changeHandler = (e) => {
    const { target: { form } } = e;
    let pageSlug = form[0].value;
    pageSlug = pageSlug.toLowerCase();
    pageSlug = pageSlug.replace(/(?:\\[rn]|[\r\n]+)+/g, "");
    pageSlug = pageSlug.trim().split(' ')
    pageSlug = pageSlug.map((word) => word.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
    pageSlug = pageSlug.join();
    pageSlug = pageSlug.replace(/\.$/, '');
    const regex = /[^\w]\s*/g;
    pageSlug = pageSlug.replace(regex, '-');
    formRef.current[formRef.current.length - 1].value = `stf/${sheetSlug}/${pageSlug}`;
  }

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar / Criar Entrada e Página</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit} ref={ref}>
          {formData.current && formData.current.map(([[key, value, type]]) => {
            return (
              <Form.Row>
                <Form.Group as={Col} md="12" controlId={`formBasic${key}`} >
                  <Form.Label>{key}:</Form.Label>
                  <Form.Control
                    onChange={(e) => changeHandler(e)}
                    ref={(ref) => formRef.current.push(ref)}
                    as={type === 'textarea' ? type : 'input'}
                    type={type}
                    row={type === 'textarea' ? 3 : 1}
                    placeholder={key}
                    defaultValue={value}
                    required
                    disabled={key === 'URL' ? true : false}
                  />
                  <Form.Control.Feedback>OK!</Form.Control.Feedback>
                  <Form.Control.Feedback type="invalid">Campos não podem estar vazios</Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
            )
          })}
          <Form.Row>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">Salvar</Button>
          </Form.Row>
        </Form>
      </Modal.Body>
    </Modal>
  )
})

export default EditorModal;
