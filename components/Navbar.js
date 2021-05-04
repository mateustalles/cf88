import React from 'react';
import { useCurrentUser } from '@/hooks/index';

const Navbar = () => {
  const [user, { mutate }] = useCurrentUser();

  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'DELETE',
    });
    mutate(null);
  };

  return (
    <button onClick={handleLogout}>Sair</button>
  );
};

export default Navbar;
