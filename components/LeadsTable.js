/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React from 'react';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import styled from 'styled-components'

const MostViewedTableStyled = styled.div`
  min-width: 60vw;
  max-width: 60vw;
  min-height: 75vh;
  max-height: 75vh;
`
const LeadsTable = ({ data }) => {
  const columns = [
    {
      dataField: 'name',
      text: 'Nome',
      filter: textFilter({
          className: 'title-filter',
          placeholder: `Filtrar por nome`,
        })
    },
    {
      dataField: 'email',
      text: 'Email',
      headerStyle: { width: '80%' },
      filter: textFilter({
          className: 'title-filter',
          placeholder: `Filtrar por email`,
        })
    },
  ]

  return (
    <MostViewedTableStyled>
      <BootstrapTable
        bootstrap4={true}
        striped
        bordered
        responsive
        hover
        keyField="id"
        data={data}
        columns={columns}
        wrapperClasses="leads-table"
        filter={filterFactory()}
        pagination={paginationFactory()}
      />
    </MostViewedTableStyled>
  )
}
export default LeadsTable;
