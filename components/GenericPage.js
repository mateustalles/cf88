
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
  min-height: 100vh;
  max-height: 100vh;
  width: 100vw;
  justify-content: space-between;
  padding: 0;
  margin: 0;
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
