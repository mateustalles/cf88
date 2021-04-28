import { useRouter } from 'next/router'
import { findPage, getAllPages } from '../../../models/pagesModel';
import '../../../styles/Verbatim.module.css'

const Verbatim = ({ page }) => {
  const router = useRouter()
  const { sheet } = router.query
  const sheetData = page['data'];
  const { sheetTitle, data } = sheetData;
  const idVerbete = Object.values(data[data.length - 1])

  return (
    <div className="verbatim">
      <h1>{sheetTitle}: {idVerbete}</h1>
      { data.map((entry, index) => {
        const [[title, value]] = Object.entries(entry);
        if (index === 0) return <h3>{value}</h3>
        return <p key={`${title}_${value}`}>{title.toUpperCase() + ':'} {value}</p>
      }) }
    </div>
  )
}

export async function getStaticPaths() {
  const rawData = await getAllPages();
  const paths = rawData.map(({ sheetSlug, _id }) => ({
    params: { sheet: sheetSlug, id: _id }
  }));

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps(context) {
    const { params: { sheet, id } } = context;

  const page = await findPage(sheet, id);

  return {
    props: {
      page,
    },
  }
}

export default Verbatim;
