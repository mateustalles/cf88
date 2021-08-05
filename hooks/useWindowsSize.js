import { useLayoutEffect, useState} from 'react';

const useWindowSize = () => {
  //https://stackoverflow.com/questions/19014250/rerender-view-on-browser-resize-with-react
  const [windowSize, setWindowSize] = useState([0, 0]);

  useLayoutEffect(() => {
    const updateSize = () => {
      setWindowSize([window.innerWidth, window.innerHeight])
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, [])

  return windowSize;
}

export default useWindowSize;
