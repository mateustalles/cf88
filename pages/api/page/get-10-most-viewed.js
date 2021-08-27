// import nc from 'next-connect';
// import { get10MostViewed } from '@/db/index'
// import { all } from '@/middlewares/index'

// const handler = nc();
// handler.use(all);

// handler.post(async (req, res) => {
//   await get10MostViewed(req.db)
//     .then((data) => res.send(200).json(data))
//     .catch((err) => {
//       console.log(err.message)
//       throw new Error(err);
//     })
// });

// export default handler;
