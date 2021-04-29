import { useState, useEffect } from 'react';
import { getAllPages } from '../../models/pagesModel';

const ControlPanel = ({ data }) => {
  const sheets = [
    ['TESE SEM REPERCUSSÃO GERAL', 'teses-sem-repercussao-geral'],
    ['TESE COM REPERCUSSÃO GERAL', 'teses-com-repercussao-geral'],
    ['SÚMULA VINCULANTE', 'sumula-vinculante'],
    ['SÚMULA STJ', 'sumula-stj'],
    ['SÚMULA STF', 'sumula-stf'],
  ];

  const [pages, setPages] = useState([]);
  const [filter, setFilter] = useState(sheets[0][1]);

  useEffect(() => {
    const filteredSheets = data.filter(({ sheetSlug }) => sheetSlug === filter);
    console.log(filter)
    setPages([...filteredSheets]);

    return () => setPages([]);
  }, []);

  return (
    <table>
      <thead>
        {pages[0] && Object.keys(pages[0].data).map((key) => <th>{key}</th>)}
      </thead>
      <tbody>

      </tbody>
    </table>
  )
}

export async function getStaticProps() {
  const pages = await getAllPages();
  return {
    props: {
      data: [...pages],
    },
  }
}

export default ControlPanel;
