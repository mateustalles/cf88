import nc from 'next-connect';
import { updateOne } from '@/db/index';
import { all } from '@/middlewares/index';

const handler = nc();
handler.use(all);


handler.post(async (req, res) => {
  const { body } = req;

  await updateOne(req.db, body).
    then(() => res.status(200).send('Atualizada'))
    .catch((err) => {
      throw Error(err);
    });
})

export default handler;
