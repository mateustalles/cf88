import nc from 'next-connect';
import { deleteOne } from '@/db/index';
import { all } from '@/middlewares/index';

const handler = nc();
handler.use(all);

handler.delete(async (req, res) => {
  const { body } = req;

  await deleteOne(req.db, body).
    then(() => res.status(200).send('Deletado.'))
    .catch((err) => {
      throw Error(err);
    });
});

export default handler;
