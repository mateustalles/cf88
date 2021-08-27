import React, { useRef, useEffect, useContext } from 'react';
import GenericPage from '../components/GenericPage';
import useWindowSize from '../hooks/useWindowsSize';
import { CF88Context } from '../context/CF88Context'
import styled from 'styled-components';
import Container from 'react-bootstrap/Container'
import Image from 'next/image'
import introBackground from '../images/cf88-background.png'
import TopMenu from './TopMenu'
import MostViewedTableModal from '../components/MostViewedTableModal'

const IntroPageContainer = styled(GenericPage)`
  height: 100vh;
  width: 100vw;
  justify-content: space-between;
  position: relative;
`

const TableContainer = styled(Container)`
`

const MostViewedTableContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 25px;
  border: 2px solid black;
  overflow-y: scroll;

  & {
    scrollbar-width: thin;
    scrollbar-color: blue orange;
  }

  /* Works on Chrome, Edge, and Safari */
  &::-webkit-scrollbar {
    display: block;
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: blue;
    border-radius: 10%;
    border: 3px solid orange;
  }

  &::-webkit-scrollbar-track-piece:end {
    background: transparent;
    margin-bottom: 10px; 
  }

  &::-webkit-scrollbar-track-piece:start {
    background: transparent;
    margin-top: 10px;
  }
`

export default function IntroPage({ mostViewed }) {
  const { pageRefs: [, setPageRefs] } = useContext(CF88Context)

  const [, windowHeight] = useWindowSize();

  const introRef = useRef();

  useEffect(() => {
    setPageRefs((refs) => ({ ...refs, introRef }));

    return () => setPageRefs((refs) => {
      delete refs['introRef']
      const newRefs = refs;
      return newRefs;
    });
  }, [setPageRefs]);


  return (
    <IntroPageContainer
      ref={introRef}
      windowHeight={windowHeight}
      id="intro"
    >
      <Image
        src={introBackground}
        layout="fill"
        objectFit="cover"
        objectPosition="50% 50%"
        z-index={1000}
      />
      <TopMenu />
      <TableContainer>
        <MostViewedTableContainer>
            <MostViewedTableModal mostViewed={mostViewed} />
        </MostViewedTableContainer>
      </TableContainer>
    </IntroPageContainer>
  )
}
