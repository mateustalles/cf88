import React from 'react';
import { useCurrentUser } from '@/hooks/index';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

const customButton = (callback, label, path, currentPath) => (
  <Button
    variant="outline-dark"
    onClick={() => callback(path)}
    disabled={path === currentPath}
  >
    {label}
  </Button>
)
const Navbar = () => {
  const router = useRouter();
  const [user, { mutate }] = useCurrentUser();

  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'DELETE',
    });
    mutate(null);
  };

  const handleClick = (path) => {
    router.push(path);
  }

  return (
    <Container>
      {customButton(handleClick, 'Painel de controle', '/admin/cp', router.pathname)}{' '}
      {customButton(handleClick, 'Leads', '/admin/leads', router.pathname)}{' '}
      {customButton(handleClick, 'Configurações', '/admin/settings', router.pathname)}{' '}
      <Button variant="outline-dark" onClick={handleLogout}>Sair</Button>{' '}
    </Container>
  );
};

export default Navbar;
