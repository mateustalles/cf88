
import styled from 'styled-components'

const GenericPage = styled.div`
  align-items: center;
  ${(props) => props.imageUrl && `background: url(${props.imageUrl});`}
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  box-sizing: border-box;
  flex-flow: column nowrap;
  min-height: ${(props) => `${props.windowHeight}px`};
  max-height: ${(props) => `${props.windowHeight}px`};
  justify-content: space-between;
  padding: 20px 0;
  margin: 0;
  width: 100vw;
  overflow: hidden;

  p {
    color: #CBAA64;
    line-height: 20px;
    padding: 5px;
  }

  h1, h2, h3 {
    color: #CBAA64;
    letter-spacing: .2rem;
    line-height: 30px;
  }
`

export default GenericPage;
