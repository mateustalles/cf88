import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCurrentUser } from '@/hooks/index';

const LoginPage = () => {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const [user, { mutate }] = useCurrentUser();

  useEffect(() => {
    // redirect to home if user is authenticated
    if (user?.role === 'admin') return router.push('/admin/cp');
    if (user) return router.push('/');
  }, [user, router]);

  async function onSubmit(e) {
    e.preventDefault();
    const body = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    };
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.status === 200) {
      const userObj = await res.json();
      mutate(userObj);
    } else {
      setErrorMsg('Email ou senha incorreta. Tente novamente!');
    }
  }

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        {errorMsg ? <p style={{ color: 'red' }}>{errorMsg}</p> : null}
        <label htmlFor="email">
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Email"
          />
        </label>
        <label htmlFor="password">
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Senha"
          />
        </label>
        <button type="submit">Entrar</button>
        {/* <Link href="/forget-password">
          <a>Esqueci minha senha</a>
        </Link> */}
      </form>
    </>
  );
};

export default LoginPage;
