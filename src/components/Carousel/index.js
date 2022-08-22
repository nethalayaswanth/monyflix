import React, {
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { useSwiper, SwiperSlide } from "swiper/react";
//import SwiperSlide from "../swiperSlide";

import { useEpicState } from "../Epic/context";
import Slide from "../Slide";
import Card,{CardHolder} from "../Card";
import Swiperjs from "./swiper";
import AspectBox from "../AspectBox";
import useHover from "../../hooks/useHover";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import { useModalState } from "../../contexts/modalContext";
import Shimmer from "../shimmer";

export default function Carousel({
  data,
  loading,
  style,
  dark,
  epic,
  fetchMore,
  hasMore,
  isFetching,
  movies,
}) {
  const swiper = useRef();

  const [visible, elRef] = useIntersectionObserver();

  useEffect(() => {
    if (data === undefined || isFetching) return;

     
    if (visible && hasMore) {
       
      fetchMore();
    }
  }, [visible, fetchMore, data, hasMore, isFetching]);

  const [{  activated },dispatch] = useModalState();

   const [modalEnabled, setModalEnabled] = useState(true);

   useLayoutEffect(() => {

     
     dispatch({ type: "set enabled", enabled: modalEnabled });
   }, [dispatch, modalEnabled]);


   const transitionEvents={ onTransitionStart:() => {
            setModalEnabled((x)=>x?!x:x)
             
          },
          onTransitionEnd:() => {
            setModalEnabled((x) => (x ? x : !x));
              
          },
          onTouchStart:()=>{setModalEnabled((x) => (x ? !x : x))},
          
          onTouchEnd:()=>{setModalEnabled((x) => (x ? x : !x))}} 

   
  
  
  return (
    <>
      <Swiperjs
        ref={swiper}
        transitionEvents={transitionEvents}
        enabled={!activated}
      >
        {!loading && data !== undefined  ? (
          <>
            {data.map((movie, i) => {
              return (
                <SwiperSlide key={`${i}`}>
                  <Card key={i} id={i} movie={movie} />
                </SwiperSlide>
              );
            })}
            {hasMore && !loading && (
              <SwiperSlide key={"loading"}>
                <Card ref={elRef} />
              </SwiperSlide>
            )}
          </>
        ) : (
          
            [...Array(8).fill(0)].map((movie, i) => {
              return (
                <SwiperSlide key={i} index={i}>
                  <CardHolder
                    index={i}
                    style={{ backgroundColor: "	#C8C8C8" }}
                  />
                </SwiperSlide>
              );
            })
          
        )}
      </Swiperjs>
    </>
  );
}
