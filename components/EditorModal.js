/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { useRouter } from 'next/router'
import { CF88Context } from '../context/CF88Context'

const DeleteModal = (props) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Aviso de exclusão
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
          onClick={() => props.requestHandler(null, 'delete-one')}
        >
          Deletar
        </Button>
        <Button type="button" variant="secondary" onClick={props.onHide}>Cancelar</Button>
      </Modal.Footer>
    </Modal>
  );
}


const EditorModal = ({ sheetSlug }) => {
  const [validated, setValidated] = useState(false);
  const { editionModal: [
          [displayModal, setDisplayModal],
          [modalData],
          [headers],
          [type]
        ]
      } = useContext(CF88Context);
  const [pageData, setPageData] = useState({});
  const [updatedPage, setUpdatedPage] = useState({});
  const [formData, setFormData] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const router = useRouter();
  const inputRef = useRef([]);
  const formRef = useRef();


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


  const generateFields = useCallback((targetObj) => {
    const source = (type === 'blank' && headers) ? headers : modalData;
    return source && source.length > 0
    && source.map((set) => Object.entries(set).map(([key, value]) => {
      const actualValue = type === 'blank' ? '' : value;
      Object.assign(targetObj, { [key]: actualValue });
      if (value.match(/^\d{1,4}[/-]+\d{1,2}[/-]+\d{1,4}$/g)) {
        let date = value.replace(/[/-]+/g, ' ')
        date = date.split(' ');
        if(date[0].length === 1) date[0] = '0' + date[0];
        if(date[1].length === 1) date[1] = '0' + date[1];
        if(date[2].length === 1) date[2] = '0' + date[2];
        let newDate;
        if(date[0].length !== 4) {
          newDate = [date[2], date[1], date[0]].join('-');
        } else {
          newDate = [date[0], date[1], date[2]].join('-');
        }
        newDate = type === 'blank' ? new Date() : newDate;
        return [key, newDate, 'date'];
      }
      return [key, actualValue, 'textarea'];
    }));
  }, [modalData, headers, type]);


  const handleClose = () => {
    const pageData = {};
    generateFields(pageData);
    setPageData(pageData);
    setDisplayModal(false);
  };


  const handleSubmit = async (event) => {
    const sheets = [
      ['TESE SEM REPERCUSSÃO GERAL', 'teses-sem-repercussao-geral'],
      ['TESE COM REPERCUSSÃO GERAL', 'teses-com-repercussao-geral'],
      ['SÚMULA VINCULANTE', 'sumula-vinculante'],
      ['SÚMULA STJ', 'sumula-stj'],
      ['SÚMULA STF', 'sumula-stf'],
    ];


    const form = formRef.current;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      const sheetTitle = sheets.filter(([, slug]) => slug === sheetSlug)[0][0];
      const verbatimSlug = makeVerbatimSlug(Object.values(updatedPage)[1]);
      const { pageTitle: toBeUpdated } = pageData;
      const { pageTitle, ...entries } = updatedPage;
      const entriesObjects = Object.entries(entries).map(([key, value]) => ({ [key]: value }));
      const request = {
        sheetSlug,
        sheetTitle,
        verbatimSlug,
        toBeUpdated: makePageSlug(toBeUpdated),
        pageSlug: makePageSlug(pageTitle),
        data: [{ pageTitle }, ...entriesObjects],
      };
      await requestHandler(request);

      setValidated(true);
    }
  };


  const requestHandler = useCallback(async (payload, action='update-one') => {
    if (action === 'update-one') {
      await fetch('/api/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload }),
      })
        .then((res) => {
          if (res.ok) router.reload();
        });
    }
    if (action === 'delete-one') {
      const { pageTitle } = updatedPage;
      const request = {
        sheetSlug,
        pageSlug: makePageSlug(pageTitle),
      };
      await fetch('/api/delete-one', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...request }),
      })
        .then((res) => {
          if (res.ok) router.reload();
        });
    }
  }, [router, updatedPage, sheetSlug]);

  const writeToPage = (content=null) => {
    if(content) {
      const modifiedContent = content;
      Object.entries(content).forEach(([key, value]) => {
        if (value.match(/^\d{1,4}[/-]+\d{1,2}[/-]+\d{1,4}$/g)) {
          let date = value.replace(/[/-]+/g, ' ')
          date = date.split(' ');
          if(date[0].length === 1) date[0] = '0' + date[0];
          if(date[1].length === 1) date[1] = '0' + date[1];
          if(date[2].length === 1) date[2] = '0' + date[2];
          let newDate;
          if(date[0].length !== 4) {
            newDate = [date[0], date[1], date[2]].join('/');
          } else {
            newDate = [date[2], date[1], date[0]].join('/');
          }
          Object.assign(modifiedContent, { [key]: newDate });
          return { [key]: newDate };
        }
      })
      setPageData(modifiedContent);
      setUpdatedPage(modifiedContent);
    }
  }


  const writeToRequest = (field=null, value=null, urlValue=null) => {
    if(field && value && urlValue) {
      let newValue = value;
      if (value.match(/^\d{1,4}[/-]+\d{1,2}[/-]+\d{1,4}$/g)) {
        let date = value.replace(/[/-]+/g, ' ');
        date = date.split(' ');
        if(date[0].length === 1) date[0] = '0' + date[0];
        if(date[1].length === 1) date[1] = '0' + date[1];
        if(date[2].length === 1) date[2] = '0' + date[2];
        if(date[0].length !== 4) {
          newValue = [date[0], date[1], date[2]].join('/');
        } else {
          newValue = [date[2], date[1], date[0]].join('/');
        }
      }
      return setUpdatedPage((data) => ({ ...data, [field]: newValue, URL: urlValue }));
    }
  }


  useEffect(() => {
    if(displayModal) {
      const content = {};
      const data = generateFields(content)
      setFormData(data);
      writeToPage(content);
      router.prefetch('/admin/cp');
    }
  }, [generateFields, displayModal, router, type]);


  const changeHandler = (e) => {
    const { target: { form, name, value } } = e;
    const pageSlug = makePageSlug(form[0].value)
    inputRef.current[inputRef.current.length - 1].value = `https://www.cf88.com.br/stf/${sheetSlug}/${pageSlug}`;
    const urlValue = inputRef.current[inputRef.current.length - 1].value
    writeToRequest(name, value, urlValue);
  }

  return (
    <>
      <DeleteModal
        show={showDeleteModal}
        requestHandler={requestHandler}
        onHide={() => setShowDeleteModal(false)}
      />

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
          <Form noValidate validated={validated} ref={formRef}>
            {formData && formData.map(([[key, value, type]]) => {
              return (
                <Form.Row>
                  <Form.Group as={Col} md="12" controlId={`formBasic${key}`} >
                    <Form.Label>{key === 'pageTitle' ? 'Título' : key}:</Form.Label>
                    <Form.Control
                      onChange={(e) => changeHandler(e)}
                      ref={(ref) => inputRef.current.push(ref)}
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
              <Button type="button" variant="secondary" onClick={handleClose}>
                Fechar
              </Button> {' '}
              <Button variant="primary" onClick={handleSubmit}>Salvar</Button> {' '}
              <Button variant="danger" onClick={() => setShowDeleteModal(true)}>Excluir</Button>
            </Form.Row>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default EditorModal;
