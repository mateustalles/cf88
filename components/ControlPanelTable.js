/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef, useContext } from 'react';
import Table from 'react-bootstrap/Table';
import dynamic from 'next/dynamic'
import { CF88Context } from '../context/CF88Context'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

const EditorModal = dynamic(() => import('./EditorModal'))

const ControlPanelTable = ({ data, filter }) => {
  const [pages, setPages] = useState();
  const { editionModal: [, setDisplayModal, , setModalItem, , setModalHeaders] } = useContext(CF88Context);
  // const [editedItem, setEditedItem] = useState([]);


  useEffect(() => {
    const filteredPages = filter && data.filter((page) => Object.keys(page)[0] === filter);
    setPages(filteredPages);
    return () => setPages(data);
  }, [filter, setPages, data]);

  const modelHeaders = filter && pages && pages[0][filter] && pages[0][filter]['data'];
  const pageHeaders = filter && pages && modelHeaders && modelHeaders.map((page, index) => index === 0
            ? ({
              dataField: 'pageTitle',
              text: 'Título',
              filter: textFilter()
            })
            : ({
              dataField: Object.keys(page)[0],
              text: Object.keys(page)[0],
              style: Object.keys(page)[0] === 'URL' && { wordBreak: 'break-all'},
              filter: textFilter()
            })
  );

  const modalData = filter && pages && pages[0][filter] && pages.map((page) => page[filter]['data']);
  const pageData = filter && pages && modalData && Object.values(modalData)
    .map((page) => page.reduce((acc, prod) => Object.assign(acc, prod), {}))

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      setModalItem(modalData[rowIndex]);
      setModalHeaders(modelHeaders);
      setTimeout(() => setDisplayModal(true), 300);
    }
  };


  // const handleShow = (index) => {
  //   setEditedItem(pageData[index]);
  //   setDisplayModal(true);
  // }

  const formRef = useRef();

  return (
    <>
      <EditorModal
        sheetSlug={filter}
        ref={formRef}
      />
      {pageHeaders
      && pageData
      && <BootstrapTable
          striped
          bordered
          responsive
          hover
          keyField="pageTitle"
          data={pageData}
          columns={pageHeaders}
          rowEvents={rowEvents}
          filter={filterFactory()}
        />}
      {/* <Table striped bordered hover>
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
      </Table> */}
    </>
  )
}

export default ControlPanelTable;
