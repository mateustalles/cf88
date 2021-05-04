import nc from 'next-connect';
import { insertPages } from '@/db/index';
import { all } from '@/middlewares/index';
import { fetchData } from '@/lib/index';

const handler = nc();
handler.use(all);

handler.get(async (req, res) => {
  if (req.user?.role !== 'admin'){
    res.status(403).end('Não autorizado')
  }
  const sheets = await fetchData('backup');
  await insertPages(req.db, sheets)
    .then(() => res.status(200).json('Banco de dados atualizado com sucesso'))
    .catch((err) => {
      throw Error(err);
    });
});

export default handler;
