import { useContext, useEffect, useState, useRef, useMemo } from 'react';
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import { CF88Context } from '../context/CF88Context'
import useWindowSize from './useWindowsSize';

const usePageTracker = () => {
  const {
    pageRefs: [pageRefs, setPageRefs],
  } = useContext(CF88Context)
  
  const [, windowHeight] = useWindowSize();

  const [minYPos, setMinYPos] = useState(windowHeight / 2)
  const scrollAction = useRef('scrollNext');

  const orderedRefs = useMemo(() => {
    return ['introRef', 'contentRef', 'aboutUsRef']
  }, []);

  useScrollPosition(({ prevPos, currPos }) => {
    if (prevPos.y * -1 < currPos.y * -1 ) {
      scrollAction.current = 'scrollNext';
    } else {
      scrollAction.current = 'scrollPrev';
    }
    setMinYPos(currPos.y * - 1);
  }, [])


  const locked = useRef(false);
  const lastCall = useRef(false);
  const scrollbarRef = useRef('introRef')

  useEffect(() => {
    const scrollToPage = (scrollAction) => {
      if('current' in scrollbarRef && scrollbarRef.current) {
        if(locked.current) return;
        if(lastCall.current) clearTimeout(lastCall.current);
        const currentPageIndex = orderedRefs.indexOf(scrollbarRef.current)
        const nextPage = orderedRefs[currentPageIndex + 1];
        const prevPage = orderedRefs[currentPageIndex - 1];
        const page = scrollAction > 0 ? nextPage : prevPage;
        const pageOffsetTop = pageRefs[page] && pageRefs[page].current.offsetTop;

        if(page && scrollbarRef.current !== page)
          lastCall.current = setTimeout(() => {
            scrollbarRef.current = page;
            window.scrollTo({ top: pageOffsetTop, behavior: 'smooth' });
            locked.current = false;
          }, 200);

        locked.current = true;
      }
  };

    document.addEventListener('wheel', function(e) {
      e.preventDefault();
      locked.current = false;
      scrollToPage(e.deltaY);
    }, { passive: false });
  }, [orderedRefs, pageRefs, scrollbarRef])
}

export default usePageTracker;
