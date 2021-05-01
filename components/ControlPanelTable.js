/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef, useContext } from 'react';
import Table from 'react-bootstrap/Table';
import dynamic from 'next/dynamic'
import { CF88Context } from '../context/CF88Context'

const EditorModal = dynamic(() => import('./EditorModal'))

const ControlPanelTable = ({ data, filter }) => {
  const [pages, setPages] = useState();
  const { editionModal: [displayModal, setDisplayModal] } = useContext(CF88Context);
  const [editedItem, setEditedItem] = useState([]);

  useEffect(() => {
    const filteredPages = filter && data.filter((page) => Object.keys(page)[0] === filter);
    setPages(filteredPages);
    return () => setPages(data);
  }, [filter, setPages, data]);

  const pageHeaders = pages && pages[0][filter] && pages[0][filter]['data']
  const pageData = pages && pages[0][filter] && pages.map((page) => page[filter]['data']);

  const handleShow = (index) => {
    setEditedItem(pageData[index]);
    setDisplayModal(true);
  }

  const formRef = useRef();

  return (
    <>
      <EditorModal
        data={editedItem}
        sheetSlug={filter}
        headers={pageHeaders}
        showModal={displayModal}
        // handleClose={handleClose}
        ref={formRef}
      />
      <Table striped bordered hover>
        <thead>
          {pageHeaders && pageHeaders.map((page, index) => index === 0
            ? <th>Título</th> : <th>{Object.keys(page)}</th>)}
        </thead>
        <tbody>
            {pageData && Object.values(pageData).map((page, index) => (
              <tr>
                {page.map((obj) => Object.values(obj).map((value) => (
                <td onClick={() => handleShow(index)}>
                  {value}
                </td>
                )))}
              </tr>
              )
            )}
        </tbody>
      </Table>
    </>
  )
}

export default ControlPanelTable;
