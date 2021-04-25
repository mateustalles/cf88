import { useRouter } from 'next/router'
import { findPage } from '../../../../models/pagesModel';
import { fetchData } from '../../../../libs/fetchData'
import '../../../../styles/Verbatim.module.css'

const Verbatim = ({ page }) => {
  const router = useRouter()
  const { sheet } = router.query
  const sheetData = page[sheet];
  const { sheetTitle, data } = sheetData;
  const idVerbete = Object.values(data[data.length - 1])

  return (
    <div className="verbatim">
      <h1>{sheetTitle}: {idVerbete}</h1>
      { data.map((entry, index) => {
        const [[title, value]] = Object.entries(entry);
        if (index === 0) return <h3>{value}</h3>
        return <p>{title.toUpperCase() + ':'} {value}</p>
      }) }
    </div>
  )
}

export async function getStaticPaths() {
  const rawData = await fetchData();
  const paths = rawData.map(({ sheetSlug, _id, verbatimSlug }) => ({
    params: { sheet: sheetSlug, id: _id, verbatim: verbatimSlug }
  }));

  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps(context) {
    const { params: { sheet, id, verbatim } } = context;

  const page = await findPage(sheet, id, verbatim)

  return {
    props: {
      page,
    },
  }
}

export default Verbatim;
