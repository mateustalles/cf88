import nc from 'next-connect';
import { getAllPages } from '@/db/index';
import { fetchXlsx, uploadFile } from '@/lib/index';
import { all } from '@/middlewares/index';

const handler = nc();
handler.use(all);

handler.get(async (req, res) => {
  const allPages = await getAllPages(req.db)
    .then((data) => data)
    .catch((err) => {
      throw Error(err);
    });
  const fileName = fetchXlsx(allPages)

  await uploadFile(req, res, fileName)
})

export default handler;
