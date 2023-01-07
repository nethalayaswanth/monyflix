import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import flattenChildren from "react-keyed-flatten-children";
import styled from "styled-components";

const CarouselItem = styled.div`
  margin-left: 1rem;
`;

const CarouselContainer = styled.div`
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  -ms-overflow-style: none;
  scrollbar-width: none;
  display: flex;
  height: 100%;
  width: 100%;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const SwiperContext = createContext();

function getPrevElement(list) {
  const sibling = list[0].previousElementSibling;

  if (sibling instanceof HTMLElement) {
    return sibling;
  }

  return sibling;
}

function getNextElement(list) {
  const sibling = list[list.length - 1].nextElementSibling;

  if (sibling instanceof HTMLElement) {
    return sibling;
  }

  return null;
}

function useSwiperHandler(ref) {
  const [prevElement, setPrevElement] = useState(null);
  const [nextElement, setNextElement] = useState(null);
  const [visiblelements, setVisiblelements] = useState(null);
  const [visiblelementsIndices, setVisiblelementsIndices] = useState(null);
  const [activeIndex, setActiveIndex] = useState();

  useEffect(() => {
    const element = ref.current;
    const compStyles = window.getComputedStyle(element);

    const paddingLeft = compStyles.getPropertyValue("padding-left");
    const paddingRight = compStyles.getPropertyValue("padding-right");

    const update = () => {
      const rect = element.getBoundingClientRect();

      const visibleItems = {};

      const visibleElements = Array.from(element.children).forEach(
        (child, index) => {
          const childRect = child.getBoundingClientRect();
          if (
            childRect.right >= rect.left + paddingLeft &&
            childRect.left <= rect.right - paddingRight
          ) {
            visibleItems[index] = child;
          }
        }
      );

      if (Object.keys(visibleItems) > 0) {
        setVisiblelements(Object.values(visibleItems));
        setVisiblelementsIndices(Object.keys(visibleItems));
      }
    };

    update();

    element.addEventListener("scroll", update, { passive: true });

    return () => {
      element.removeEventListener("scroll", update, { passive: true });
    };
  }, [ref]);

  const scrollToElement = useCallback(
    (element) => {
      const currentNode = ref.current;

      if (!currentNode || !element) return;

      let newScrollPosition;

      newScrollPosition =
        element.offsetLeft +
        element.getBoundingClientRect().width / 2 -
        currentNode.getBoundingClientRect().width / 2;

      currentNode.scroll({
        left: newScrollPosition,
        behavior: "smooth",
      });
    },
    [ref]
  );

  const scrollRight = useCallback(
    () => scrollToElement(nextElement),
    [scrollToElement, nextElement]
  );

  const scrollLeft = useCallback(
    () => scrollToElement(prevElement),
    [scrollToElement, prevElement]
  );
}

function Swiper(
  { children, spaceBetween = 10, align = "start", initialIndex = 0,onSlideChange=()=>{}, ...props },
  ref
) {
  const SwiperRef = useRef();
 
  const [visiblelementsIndices, setVisiblelementsIndices] = useState(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [activeElement, setActiveElement] = useState(null);
  const [isEnd, setIsEnd] = useState(null);
  const [isBeginning, setIsBeginning] = useState(null);
const activeIndexRef = useRef(activeIndex);
  

 

  const scrollToIndex = useCallback(
    (index, { scrollBehaviour = "smooth" } = {}) => {
      const element = SwiperRef.current;
      const currentNode = Array.from(element.children)[index];

      if (!currentNode || !element) return;

      const centerPosition =
        element.offsetLeft +
        element.getBoundingClientRect().width / 2 -
        currentNode.getBoundingClientRect().width / 2;
      const startPosition = currentNode.offsetLeft;

      const newScrollPosition =
        align === "start" ? startPosition : centerPosition;

      console.log(index);

      element.scroll({
        left: newScrollPosition,
        behavior: scrollBehaviour,
      });

       setActiveIndex(index);
       activeIndexRef.current = index;    
    },
    [align]
  );

  const next = useCallback(
    (options) => {
      console.log("next", activeIndexRef.current + 1);
      if (isEnd) return;
      scrollToIndex(activeIndexRef.current + 1, options);
    },
    [isEnd, scrollToIndex]
  );

  const prev = useCallback(
    (options) => {
      console.log("prev", activeIndexRef.current - 1);
      if (isBeginning) return;
      scrollToIndex(activeIndexRef.current - 1, options);
    },
    [isBeginning, scrollToIndex]
  );

  const swiper =useRef

  swiper.current= {
      activeIndex,
      next,
      prev,
      scrollToIndex,
      isEnd,
      isBeginning,
    }

  const handleScroll = useCallback(
    ({ childNodes, element, paddingLeft, paddingRight }) => {
      const rect = element.getBoundingClientRect();

      const visibleItems = [];

      childNodes.forEach((child, index) => {
        const childRect = child.getBoundingClientRect();
        if (
          Math.round(childRect.left) >= Math.round(rect.left + paddingLeft) &&
          Math.round(childRect.right) <= Math.round(rect.right - paddingRight)
        ) {
          visibleItems.push(index);
        }

        const alignStartBound =
          childRect.left >= rect.left + paddingLeft - childRect.width / 2 &&
          childRect.left <= rect.left + paddingLeft + childRect.width / 2;

        const alignCenterBound =
          childRect.left < rect.left + rect.width / 2 &&
          childRect.right > rect.left + rect.width / 2;

        const inBounds = align === "start" ? alignStartBound : alignCenterBound;

        // console.log(inBounds,index)
        if (inBounds) {
        
          const slideChanged = activeIndexRef.current !== index;
          // console.log("chnaged", slideChanged, activeIndexRef.current,index);
          if (slideChanged) {
           
             setActiveIndex(index);
             setActiveElement(child);
             console.log('changed')

             onSlideChange({...swiper.current,activeIndex:index});
             activeIndexRef.current = index;
         
          }
          
        }
      });

      setIsEnd(visibleItems.includes(childNodes.length - 1));

      setIsBeginning(visibleItems.includes(0));

      if (visibleItems.length > 0) {
        setVisiblelementsIndices(visibleItems);
      }
    },
    [align]
  );

  useEffect(() => {
    const element = SwiperRef.current;
    const compStyles = window.getComputedStyle(element);

    const paddingLeft = parseFloat(
      compStyles.getPropertyValue("padding-left").match(/\d+/)[0]
    );
    const paddingRight = parseFloat(
      compStyles.getPropertyValue("padding-right").match(/\d+/)[0]
    );

    const childNodes = Array.from(element.children);

    const update=()=>{
// handleScroll({ element, paddingLeft, paddingRight, childNodes });
    }

  update()


    scrollToIndex(initialIndex);
    

    element.addEventListener("scroll", update, { passive: true });

    return () => {
      element.removeEventListener("scroll", update, { passive: true });
    };
  }, [align, handleScroll, initialIndex, ref, scrollToIndex]);



  const SwiperRefCb = useCallback(
    (swiperNode) => {
      SwiperRef.current = swiperNode;

      ref.current = { ...swiper.current, swiperNode };
    },
    [ref, swiper]
  );

  return (
    <SwiperContext.Provider value={swiper.current}>
      <CarouselContainer id="swiper" ref={SwiperRefCb}>
        {flattenChildren(children).map((child, index) =>
          React.cloneElement(child, {
            style: {
              flex: " 0 0 auto",
              scrollSnapAlign: align,
              ...(child.props.style && child.props.style),
              ...(spaceBetween && { marginRight: spaceBetween }),
            },
          })
        )}
      </CarouselContainer>
    </SwiperContext.Provider>
  );
}

const TrailSwiper = forwardRef(Swiper);

export function useSwiper() {
  const context = useContext(SwiperContext);
  if (context === undefined) {
    throw new Error("useSwiper must be used within a Swiper");
  }

  return context;
}

export default TrailSwiper;
