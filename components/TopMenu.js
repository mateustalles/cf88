import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Contents = styled.div`
  position: fixed;
  font-family: 'IBM Plex Sans', sans-serif;
  min-width: 98vw;
  max-width: 98vw;
  margin-right: 1.35vw;
  z-index: 2020;
`;

const MenuContainer = styled.div`
  border-radius: 15px;
  display: flex;
  background: #FFFFF0;
  flex: row nowrap;
  height: ${(props) => props.display ? '13vh' : '8vh'};
  transition: all 0.5s;
  justify-content: space-around;
`

const LinksContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex: row nowrap;
  max-width: 50%;
  justify-content: space-around;
  align-items: center;
  position: relative;
`

const NavLink = styled.a`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 25px;
  background: transparent;
  border: 0;
  border-radius: 25px;
  font-family: 'IBM Plex Sans', sans-serif;
  color: black;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.5s;

  :hover {
    text-decoration: underline;
    background: rgba(95,231,108, 0.7)
  }
`

const TopMenu = () => {
  const [display, setDisplay] = useState(false);
  const [isRendered, setIsRendered] = useState(true);

  useEffect(() => {
    let timeout;
    window.addEventListener('mousemove', (e) => {
      if(e.clientY <= 50) {
        setDisplay(true);
      } else {
        if(display && !timeout) {
          timeout = setTimeout(() => setDisplay(false), 750);
        }
      }
    })

    return () => clearTimeout(timeout);
  }, [display]);
  
  return (
    isRendered && <Contents display={display}>
      <MenuContainer display={display}>
        <LinksContainer>
          <NavLink>Principal</NavLink>
          <NavLink>Contato</NavLink>
          <NavLink>Sobre nós</NavLink>
        </LinksContainer>
      </MenuContainer>
    </Contents>
  )
}

export default TopMenu;
