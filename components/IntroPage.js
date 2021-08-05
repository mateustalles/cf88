import React, { useRef, useEffect, useContext } from 'react';
import GenericPage from '../components/GenericPage';
import useWindowSize from '../hooks/useWindowsSize';
import { CF88Context } from '../context/CF88Context'
import styled from 'styled-components';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const IntroPageContainer = styled(GenericPage)`
  * {
    margin: 0;
    padding: 0;
  }
  &#intro {
    height: 100vh;
    width: 100vw;
    background-color: blue;
    background-image: linear-gradient(10deg, lightblue 50%, transparent 50%), linear-gradient(-60deg, brown 30%, transparent 30%);
  }
  justify-content: center;
`

export default function CarouselPage() {
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
      <Container>
        <Row>
          <Col>
            <h1>Logo</h1>
          </Col>
          <Col>
            <h1>Literalidades</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <h1>Seja bem-vindo!!</h1>
          </Col>
        </Row>
      </Container>
    </IntroPageContainer>
  )
}
