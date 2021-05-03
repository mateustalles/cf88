/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef, useContext } from 'react';
import dynamic from 'next/dynamic'
import { CF88Context } from '../context/CF88Context'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, Comparator } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

const EditorModal = dynamic(() => import('./EditorModal'))

const ControlPanelTable = ({ data, filter }) => {
  const [pages, setPages] = useState();
  const { editionModal: [, setDisplayModal, , setModalItem, , setModalHeaders] } = useContext(CF88Context);
  const [pagination, setPagination] = useState({ page: 1, size: 10 });

  const paginationSetup = paginationFactory({
    onPageChange: (num) => setPagination((data) => ({ ...data, page: num })),
    onSizePerPageChange: (size) => setPagination((data) => ({ ...data, size: size })),
  });


  useEffect(() => {
    const filteredPages = filter && data.filter((page) => Object.keys(page)[0] === filter);
    setPages(filteredPages);
    return () => setPages(data);
  }, [filter, setPages, data]);

  const setDataType = (data) => {
    if (data.match(/^\d{2}\/\d{2}\/\d{4}$/g)) return { type: 'date', filterFunc: textFilter };
    if (data.match(/^[\d]+$/g)) return { type: 'number', filterFunc: textFilter };
    return { type: 'text', filterFunc: textFilter };
  }

  const modelHeaders = filter && pages && pages[0][filter] && pages[0][filter]['data'];

  const modalData = filter && pages && pages[0][filter] && pages.map((page) => page[filter]['data']);

  const pageData = filter && pages && modalData && Object.values(modalData)
    .map((page) => page.reduce((acc, prod) => Object.assign(acc, prod), {}))

  const pageHeaders = filter && pages && modelHeaders && modelHeaders.map((page, index) => {
    const item = Object.keys(page)[0];
    const sampleData = pageData[0][item];
    const dataType = setDataType(sampleData).type;
    return index === 0
      ? ({
        dataField: 'pageTitle',
        text: 'Título',
        comparator: Comparator.LIKE, // default is Comparator.LIKE
        filter: textFilter({
          className: 'title-filter',
          placeholder: item === 'pageTitle'
            ? 'Por sigla ou número'
            : `Filtrar ${item}`,
        }),
        sort: true
      })
      : ({
        dataField: index === 0 ? 'pageTitle' : item,
        text: index === 0 ? 'Título' : item,
        style: item === 'URL' && { wordBreak: 'break-all'},
        filter: textFilter({
          className: 'title-filter',
          placeholder: item === 'pageTitle' ? 'Por sigla ou número' : `Filtrar ${item}`,
        }),
      })
  });

  const rowEvents = {
    onClick: (e, row) => {
      const { pageTitle } = row;
      const modalItem = modalData.filter((([{ pageTitle: title }]) => pageTitle === title ))[0]
      setModalItem(modalItem);
      setModalHeaders(modelHeaders);
      setTimeout(() => setDisplayModal(true), 300);
    }
  };

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
          bootstrap4={true}
          striped
          bordered
          responsive
          hover
          keyField="pageTitle"
          data={pageData}
          columns={pageHeaders}
          rowEvents={rowEvents}
          filter={filterFactory()}
          pagination={paginationSetup}
        />}
    </>
  )
}

export default ControlPanelTable;
