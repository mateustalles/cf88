/* eslint-disable react/prop-types */
import React, { useEffect, useContext } from 'react';
import Head from 'next/head';
import axios from 'axios';
import querystring from 'querystring';
import { CF88Context } from '@/context/CF88Context'

const OAuth2 = ({ code }) => {
  const { gOAuth2: [
      oAuth2Token, setOAuth2Token,
    ] } = useContext(CF88Context);

  useEffect(() => {
    console.log(code);
    // setOAuth2Token(token);
    const fetchRequest = async() => {
      await axios.post('/api/google-auth', {
        code: code,
      },{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }}).then((data) => data)
      .catch((err) => {
        throw new Error(err);
      })
    }

    code && fetchRequest();
  }, [code])

  return (
    <>
      <Head>
      </Head>
      Por favor, copie e cole esse código na próxima tela:
      <h3>{code}</h3>
    </>
  );
};

export async function getServerSideProps(context) {
  const { query } = context;
  const code = query.code
  // const token = await axios.post('https://oauth2.googleapis.com/token',
  //     querystring.stringify({
  //       code: code,
  //       client_id: process.env.OAUTH_CLIENT_ID,
  //       client_secret: process.env.CLIENT_SECRET,
  //       redirect_uri: 'http://localhost:3000/oauth2callback',
  //       grant_type: 'authorization_code'
  //     }), {
  //   headers: {
  //     "Content-Type": "application/x-www-form-urlencoded"
  //   },
  // }).then((data) => data.data);

  return {
    props: {code}
  }
}

export default OAuth2;
