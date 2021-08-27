import React, { useRef, useEffect, useContext } from 'react';
import GenericPage from '../components/GenericPage';
import useWindowSize from '../hooks/useWindowsSize';
import { CF88Context } from '../context/CF88Context'
import styled from 'styled-components';
import Container from 'react-bootstrap/Container'

const AboutUsPageContainer = styled(GenericPage)`
  height: 100vh;
  width: 100vw;
  justify-content: space-between;
  position: relative;
  background: rgb(75,184,74);
`

const ContentContainer = styled(Container)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 25px;
  overflow-y: scroll;
  padding: 15px;
  overflow: hidden;
  color: white;

  h1 {
    color: white;
    padding: 25px;
  }
`

export default function AboutUsPage() {
  const { pageRefs: [, setPageRefs] } = useContext(CF88Context)

  const [, windowHeight] = useWindowSize();

  const aboutUsRef = useRef();

  useEffect(() => {
    setPageRefs((refs) => ({ ...refs, aboutUsRef }));

    return () => setPageRefs((refs) => {
      delete refs['aboutUsRef']
      const newRefs = refs;
      return newRefs;
    });
  }, [setPageRefs]);


  return (
    <AboutUsPageContainer
      ref={aboutUsRef}
      windowHeight={windowHeight}
      id="about-us"
    >
    <ContentContainer>
      <h1>Quem somos nós</h1>
    </ContentContainer>
    </AboutUsPageContainer>
  )
}
