import nc from 'next-connect';
import { getAllPages } from '@/db/index';
import { all } from '@/middlewares/index';

const handler = nc();
handler.use(all);

handler.get(async (req, res) => {
  await getAllPages().
    then((data) => res.status(200).json(data))
    .catch((err) => {
      throw Error(err);
    });
})

export default handler;
