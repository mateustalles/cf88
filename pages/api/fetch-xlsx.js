import nc from 'next-connect';
import { getAllPages } from '@/db/index';
import { fetchXlsx } from '@/lib/index';
import { all } from '@/middlewares/index';

const handler = nc();
handler.use(all);

handler.get(async (req, res) => {
  const allPages = await getAllPages(req.db).
    then((data) => data)
    .catch((err) => {
      throw Error(err);
    });

  if(fetchXlsx(allPages)) return res.status(200).send('Arquivo criado com sucesso');
  throw new Error(500, 'Erro na criação de arquivo');
})

export default handler;
