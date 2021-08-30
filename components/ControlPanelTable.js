/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from 'react';
import dynamic from 'next/dynamic'
import { CF88Context } from '../context/CF88Context'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, Comparator, numberFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

const EditorModal = dynamic(() => import('./EditorModal'))

const ControlPanelTable = ({ data }) => {
  const [pages, setPages] = useState();
  const { editionModal:
          [
            [, setDisplayModal],
            [, setModalItem],
            [, setModalHeaders],
            [, setModalType]
          ],
          cpTable: [
            filter,
          ],
    } = useContext(CF88Context);

  useEffect(() => {
    const filteredPages = filter && data.filter((page) => Object.keys(page)[0] === filter);
    setPages(filteredPages);
    return () => setPages(data);
  }, [filter, setPages, data]);

  const modalHeaders = filter && pages && data.filter((entry) => entry[filter])[0][filter]['data'];

  const modalData = filter && pages && pages[0][filter] && pages.map((page) => page[filter]['data']);

  const pageData = filter && pages && modalData && modalData
    .map((page) => {
      const newObj = page.reduce((acc, prod) => {
        return Object.assign(acc, prod)
      }, {})
      if(!('views' in newObj)) {
        return Object.assign(newObj, { views: 0 });
      }
      return newObj;
    })

  const pageHeaders = filter && pages && modalHeaders && modalHeaders.map((page, index) => {
    const item = Object.keys(page)[0];
    if(index === 0) {
      return ({
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
    } else if( item === 'views') {
      return ({
        dataField: item,
        text: 'Visualizações',
        style: null,
        filter: numberFilter({
          style: { display: 'block'}, 
          placeholder: item === 'pageTitle' ? 'Por sigla ou número' : `Filtrar ${item}`,
        }),
      })
    } else {
      return ({
        dataField: index === 0 ? 'pageTitle' : item,
        text: index === 0 ? 'Título' : item,
        style: item === 'URL' && { wordBreak: 'break-all'},
        filter: textFilter({
          className: 'title-filter',
          placeholder: item === 'pageTitle' ? 'Por sigla ou número' : `Filtrar ${item}`,
        }),
      })
    }
  });

  const rowEvents = {
    onClick: (e, row) => {
      const { pageTitle } = row;
      const modalItem = modalData.filter((([{ pageTitle: title }]) => pageTitle === title ))[0];
      setModalType('update');
      setModalItem(modalItem);
      setModalHeaders(modalHeaders);
      setTimeout(() => setDisplayModal(true), 300);
    }
  };

  return (
    <>
      <EditorModal
        sheetSlug={filter}
      />
      {
        pageHeaders && pageData
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
          pagination={paginationFactory()}
        />
      }
    </>
  )
}

export default ControlPanelTable;
