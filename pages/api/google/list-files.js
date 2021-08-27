import nc from 'next-connect';
import { listFiles } from '@/lib/index'
import { all } from '@/middlewares/index'

const handler = nc();
handler.use(all);

handler.get(async (req, res) => {
  await listFiles()
    .then((data) => res.send(200).json(data))
    .catch((err) => {
      throw new Error(err);
    })
});

export default handler;
