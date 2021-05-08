import nc from 'next-connect';
import { getAllPages } from '@/db/index';
import { fetchXlsx, uploadFile } from '@/lib/index';
import { all } from '@/middlewares/index';
import { file } from 'googleapis/build/src/apis/file';

const handler = nc();
handler.use(all);

handler.get(async (req, res) => {
  const allPages = await getAllPages(req.db)
    .then((data) => data)
    .catch((err) => {
      console.error(err.message);
    });

  const fileName = fetchXlsx(allPages);

  setTimeout(async () => {
      await uploadFile(fileName)
        .then(() => res.status(200).json(fileName))
        .catch((err) => console.error(err.message))
    }
  , 2000)

})

export default handler;
