import nc from 'next-connect';
import { all } from '@/middlewares/index'
import nodemailer from 'nodemailer';

const handler = nc();
handler.use(all);

handler.post(async (req, res) => {
  const { body: { message, email, name } } = req;

  let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'literalidadecf88@gmail.com',
        pass: 'senha'
    }
  });
    
  let mailDetails = {
      from: 'tokadevltda@gmail.com',
      to: email,
      subject: `Mensagem de ${name}`,
      text: message
  };
    
  mailTransporter.sendMail(mailDetails, function(err, data) {
      if(err) {
          console.error(err)
          // console.log('Error Occurs');
      } else {
          console.log('Email sent successfully');
      }
  });
});

export default handler;
