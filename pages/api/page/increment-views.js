import nc from 'next-connect';
import { incrementViews } from '@/db/index'
import { all } from '@/middlewares/index'

const handler = nc();
handler.use(all);

handler.post(async (req, res) => {
  const { body: { sheetSlug, pageSlug } } = req;
  await incrementViews(req.db, sheetSlug, pageSlug)
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      throw new Error(err);
    })
});

export default handler;
