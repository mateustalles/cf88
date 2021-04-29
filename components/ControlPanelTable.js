import React, { useState, useEffect, useRef } from 'react';
import Table from 'react-bootstrap/Table';


const ControlPanelTable = ({ data, filter }) => {
  const [pages, setPages] = useState();

  useEffect(() => {
    const filteredPages = filter && data.filter((page) => Object.keys(page)[0] === filter);
    setPages(filteredPages);
    return () => setPages(data);
  }, [filter, setPages, data]);

  const pageHeaders = pages && pages[0][filter] && pages[0][filter]['data']
  const pageData = pages && pages[0][filter] && pages.map((page) => page[filter]['data']);
  return (
    <>
      <Table striped bordered hover>
        <thead>
          {pageHeaders && pageHeaders.map((page, index) => index === 0
            ? <th>Título</th> : <th>{Object.keys(page)}</th>)}
        </thead>
        <tbody>
          <div></div>
            {pageData && Object.values(pageData).map((page, index) => {
              const identifier = Math.floor(Math.random() * 99999999);
              return (
                <tr>
                  {page.map((obj) => Object.values(obj).map((value) => (
                  <td>
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
