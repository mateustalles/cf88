import nc from 'next-connect';
import { createLead } from '@/db/index'
import { all } from '@/middlewares/index'

const handler = nc();
handler.use(all);

handler.post(async (req, res) => {
  const { body } = req;
  await createLead(req.db, body)
    .then((data) => res.send(200).json(data))
    .catch((err) => {
      console.log(err.message)
      throw new Error(err);
    })
});

export default handler;
