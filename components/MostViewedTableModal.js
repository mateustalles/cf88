import React from 'react';
import styled from 'styled-components';
import Link from 'next/link'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import BootstrapTable from 'react-bootstrap-table-next';

const MostViewedTableStyled = styled.div`
  min-width: 60vw;
  max-width: 60vw;
  min-height: 75vh;
  max-height: 75vh;
  
  table * {
    color: white;
  }
`

export default function MostViewedTableModal({ mostViewed }) {
  const sheetList = {
    'TESE SEM REPERCUSSÃO GERAL': 'Tese de Repercussão Geral',
    'TESE COM REPERCUSSÃO GERAL': 'Tese de Repercussão Geral',
    'SÚMULA VINCULANTE': 'VERBETE',
    'SÚMULA STJ': 'VERBETE',
    'SÚMULA STF': 'VERBETE',
  }

  const data = mostViewed.map((verbatim, index) => {
    const verbatimType = Object.keys(verbatim).find((key) => key !== 'views');
    const { views } = verbatim;
    const { sheetTitle, data } = verbatim[verbatimType]
    const pageTitle = data.find((item) => item['pageTitle'])['pageTitle']
    const correspondentTitle = sheetList[sheetTitle]
    const thesis = data.find((item) => item[correspondentTitle])[correspondentTitle]
    const url = data.find((item) => item['URL'])['URL']
    return {
      id: index + 1,
      verbatim: <Link href={url}>{`${sheetTitle} ${pageTitle} - ${thesis}`}</Link>,
      views: views
      }
  })

  const columns = [
    { dataField: 'id', text: '#'},
    { dataField: 'verbatim', text: 'Verbete', headerStyle: { width: '80%' } },
    { dataField: 'views', text: 'Visitas'}
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
        wrapperClasses="most-viewed-table-modal"
        // rowEvents={rowEvents}
      />
    </MostViewedTableStyled>
  )
}
