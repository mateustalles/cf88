import React, { useRef, useEffect, useContext } from 'react';
import GenericPage from '../components/GenericPage';
import useWindowSize from '../hooks/useWindowsSize';
import { CF88Context } from '../context/CF88Context'
import styled from 'styled-components';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import Image from 'next/image'
import Link from 'next/link'
import introBackground from '../images/cf88-background.png'
import TopMenu from './TopMenu'
import MostViewedTableModal from '../components/MostViewedTableModal'

const IntroPageContainer = styled(GenericPage)`
  height: 100vh;
  width: 100vw;
  justify-content: space-between;
  position: relative;
`

const MostViewedTableContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 25px;
  border: 2px solid black;
  overflow-y: scroll;
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

  console.log(mostViewed)

  return (
    <IntroPageContainer
      ref={introRef}
      windowHeight={windowHeight}
      id="intro"
    >
      {/* <Image
        src={introBackground}
        layout="fill"
        objectFit="cover"
        objectPosition="50% 50%"
        z-index={1000}
      /> */}
      <TopMenu />
      <Container>
        <MostViewedTableContainer>
            <MostViewedTableModal mostViewed={mostViewed} />
        </MostViewedTableContainer>
      </Container>
    </IntroPageContainer>
  )
}
