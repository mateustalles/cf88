import React, { useRef, useEffect, useContext } from 'react';
import GenericPage from '../components/GenericPage';
import useWindowSize from '../hooks/useWindowsSize';
import { CF88Context } from '../context/CF88Context'
import styled from 'styled-components';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const ContentPageContainer = styled(GenericPage)`
  justify-content: center;
  position: relative;
`

export default function ContentPage() {
  const { pageRefs: [, setPageRefs] } = useContext(CF88Context)

  const [, windowHeight] = useWindowSize();

  const contentRef = useRef();

  useEffect(() => {
    setPageRefs((refs) => ({ ...refs, contentRef }));

    return () => setPageRefs((refs) => {
      delete refs['contentRef']
      const newRefs = refs;
      return newRefs;
    });
  }, [setPageRefs]);

  return (
    <ContentPageContainer
      ref={contentRef}
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
    </ContentPageContainer>
  )
}
