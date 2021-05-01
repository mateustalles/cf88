/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import Table from 'react-bootstrap/Table';
import EditorModal from './EditorModal';


const ControlPanelTable = ({ data, filter }) => {
  const [pages, setPages] = useState();
  const [editedItem, setEditedItem] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const filteredPages = filter && data.filter((page) => Object.keys(page)[0] === filter);
    setPages(filteredPages);
    return () => setPages(data);
  }, [filter, setPages, data]);

  const pageHeaders = pages && pages[0][filter] && pages[0][filter]['data']
  const pageData = pages && pages[0][filter] && pages.map((page) => page[filter]['data']);

  const handleShow = (index) => {
    setEditedItem(pageData[index]);
    setShowModal(true);
  }

  const handleClose = () => setShowModal(false);

  const formRef = useRef();

  useEffect(() => {
    formRef.current && formRef.current.addEventListener('onLoad', () => {
      console.log('enviado')
    })
    console.log(formRef.current)
  }, [formRef]);

  return (
    <>
      <EditorModal
        data={editedItem}
        sheetSlug={filter}
        headers={pageHeaders}
        showModal={showModal}
        handleClose={handleClose}
        ref={formRef}
      />
      <Table striped bordered hover>
        <thead>
          {pageHeaders && pageHeaders.map((page, index) => index === 0
            ? <th>Título</th> : <th>{Object.keys(page)}</th>)}
        </thead>
        <tbody>
            {pageData && Object.values(pageData).map((page, index) => {
              const identifier = Math.floor(Math.random() * 99999999);
              return (
                <tr>
                  {page.map((obj) => Object.values(obj).map((value) => (
                  <td onClick={() => handleShow(index)}>
                    {value}
                  </td>
                  )))}
                </tr>
              )
            })}
        </tbody>
      </Table>
    </>
  )
}

export default ControlPanelTable;
