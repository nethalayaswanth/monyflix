import React, {
  cloneElement, useEffect, useLayoutEffect, useRef,
  useState
} from "react";
import { SwiperSlide } from "swiper/react";
   

import { useModalState } from "../../contexts/modalContext";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import Card, { CardHolder } from "../Card";
import Swiperjs from "./swiper";

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
  enabled,
  children,...props
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
        enabled={enabled || !activated}
        {...props}
      >
        {!loading && data !== undefined ? (
          <>
            {data.map((movie, i) => {
              return (
                <SwiperSlide key={`${i}`}>
                  {children ? (
                    cloneElement(children, {
                      key: i ,
                      id: i ,
                      movie:  movie ,
                    })
                  ) : (
                    <Card key={i} id={i} movie={movie} />
                  )}
                </SwiperSlide>
              );
            })}
            {hasMore && !loading && (
              <SwiperSlide key={"loading"}>
                {children ? (
                  cloneElement(children, {
                  ref :elRef
                  })
                ) : (
                  <Card ref={elRef} />
                )}
                
              </SwiperSlide>
            )}
          </>
        ) : (
          [...Array(8).fill(0)].map((movie, i) => {
            return (
              <SwiperSlide key={i} index={i}>
                {children ? (
                  cloneElement(children, {
                    key: i,
                    id: i,
                    movie: movie,
                  })
                ) : (
                  <CardHolder
                    index={i}
                    style={{ backgroundColor: "	#C8C8C8" }}
                  />
                )}
              </SwiperSlide>
            );
          })
        )}
      </Swiperjs>
    </>
  );
}
