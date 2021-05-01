/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useEffect, useState, useRef, forwardRef, useCallback, useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { useRouter } from 'next/router'
import { CF88Context } from '../context/CF88Context'


const EditorModal = forwardRef(({ data, sheetSlug, headers, type='update' }, ref) => {
  const [validated, setValidated] = useState(false);
  const { editionModal: [displayModal, setDisplayModal] } = useContext(CF88Context);
  const [pageData, setPageData] = useState({});
  const router = useRouter();
  const formData = useRef();

  const makeVerbatimSlug = (value) => {
    let verbatimSlug = value.replace(/(?:\\[rn]|[\r\n]+)+/g, "");
    verbatimSlug = verbatimSlug.trim().split(' ')
    verbatimSlug = verbatimSlug.map((word) => word.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
    verbatimSlug = verbatimSlug.join();
    verbatimSlug = verbatimSlug.replace(/\.$/, '');
    const regex = /[^\w\s]+/g;
    verbatimSlug = verbatimSlug.replace(regex, '-');
    verbatimSlug = verbatimSlug.toLowerCase();
    return verbatimSlug;
  }

  const makePageSlug = (value) => {
    let pageSlug = value.toLowerCase();
    pageSlug = pageSlug.replace(/(?:\\[rn]|[\r\n]+)+/g, "");
    pageSlug = pageSlug.trim().split(' ')
    pageSlug = pageSlug.map((word) => word.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
    pageSlug = pageSlug.join();
    pageSlug = pageSlug.replace(/\.$/, '');
    const regex = /[^\w]\s*/g;
    pageSlug = pageSlug.replace(regex, '-');
    return pageSlug;
  }

  const generateFields = useCallback((action=type, targetObj) => {
    const source = action === 'blank' ? headers : data;
    return source && source.map((set) => Object.entries(set).map(([key, value]) => {
      Object.assign(targetObj, { [key]: action === 'blank' ? '' : value });
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
  }, [data, headers, type]);

  const handleClose = () => {
    const pageData = {};
    generateFields('blank', pageData);
    setPageData(pageData);
    setDisplayModal(false)
  };

  const handleSubmit = async (event) => {
    const sheets = [
      ['TESE SEM REPERCUSSÃO GERAL', 'teses-sem-repercussao-geral'],
      ['TESE COM REPERCUSSÃO GERAL', 'teses-com-repercussao-geral'],
      ['SÚMULA VINCULANTE', 'sumula-vinculante'],
      ['SÚMULA STJ', 'sumula-stj'],
      ['SÚMULA STF', 'sumula-stf'],
    ];

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    const sheetTitle = sheets.filter(([, slug]) => slug === sheetSlug)[0][0];
    const verbatimSlug = makeVerbatimSlug(Object.values(pageData)[1]);
    const { pageTitle, ...entries } = pageData;
    const entriesObjects = Object.entries(entries).map(([key, value]) => ({ [key]: value }));
    const request = {
      sheetSlug,
      sheetTitle,
      verbatimSlug,
      pageSlug: makePageSlug(pageTitle),
      data: [{ pageTitle }, ...entriesObjects]
    };
    await requestHandler(request);

    setValidated(true);
  };

  const requestHandler = useCallback(async (payload, action='update-one') => {
    if (action === 'update-one') {
      await fetch('/api/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload }),
      })
      .then((res) => {
        console.log(res);
        if (res.ok) router.reload();
      })
    }
  }, [router]);


  useEffect(() => {
    const pageData = {};
    formData.current = generateFields(type, pageData);
    router.prefetch('/admin/cp')

    router.beforePopState(({ url, as, options }) => {
      // I only want to allow these two routes!
      if (as !== '/admin/cp') {
        // Have SSR render bad routes as a 404.
        window.location.href = as
        return false
      }

      return true
    })

    setPageData(pageData);

    return () => {
      const pageData = {};
      generateFields('blank', pageData);
      setPageData(pageData);
    }
  }, [data, headers, type, router, generateFields]);

  const formRef = useRef([]);

  const changeHandler = (e) => {
    const { target: { form, name, value } } = e;
    const pageSlug = makePageSlug(form[0].value)
    formRef.current[formRef.current.length - 1].value = `stf/${sheetSlug}/${pageSlug}`;

    setPageData((data) => ({ ...data, [name]: value }));
  }

  return (
    <Modal
      show={displayModal}
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
                  <Form.Label>{key === 'pageTitle' ? 'Título' : key}:</Form.Label>
                  <Form.Control
                    onChange={(e) => changeHandler(e)}
                    ref={(ref) => formRef.current.push(ref)}
                    as={type === 'textarea' ? type : 'input'}
                    name={key}
                    type={type}
                    row={type === 'textarea' ? 3 : 1}
                    placeholder={key === 'pageTitle' ? 'Título' : key}
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
