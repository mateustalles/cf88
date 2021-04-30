import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const EditorModal = ({ data, headers, showModal, handleClose }) => {

  const headerData = headers && headers.map((header) => Object.entries(header).map(([key, value]) => {
    if (key === 'pageTitle') return ['Título', value, 'text'];
    if (value.length > 30) return [key, value, 'textarea'];
    if (value.match(/\d+\/\d+\/\d+/gi)) {
      let date = value.split('/');
      if(date[0].length === 1) date[0] = '0' + date[0];
      if(date[1].length === 1) date[1] = '0' + date[1];
      const newDate = [date[2], date[1], date[0]].join('-');
      return [key, newDate, 'date'];
    }
    return [key, value, 'text'];
  }));

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Modal title</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {headerData && headerData.map(([[key, value, type]]) => {
            return (
              <Form.Group controlId={`formBasic${key}`} >
                <Form.Label>{key}:</Form.Label>
                <Form.Control
                  as={type === 'textarea' ? type : 'input'}
                  type={type}
                  row={type === 'textarea' ? 3 : 1}
                  placeholder={key}
                  defaultValue={value}
                  disabled={key === 'URL' ? true : false}
                />
              </Form.Group>
            )
            })
          }
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary">Understood</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default EditorModal;
