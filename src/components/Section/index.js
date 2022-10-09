

import React, { memo, useCallback, useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useInView } from "react-intersection-observer";
import styled from "styled-components";
import {
  useMovies, useMoviesByGenre, useTrendingMovies
} from "../../requests/requests";
import Carousel from "../Carousel";
import Divider from "../Divider";
import Header from "../Header";

const Container = styled.div`
  width: 100%;
  padding: 0;
  z-index: 1;
`;

const queryHandlers = {
  moviesByType: useMovies,
  trendingMovies: useTrendingMovies,
  moviesByGenre: useMoviesByGenre,
};

export const Wrapper = memo(
  ({
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    title,
    children,
    isLoading,
    refCb,
    ...props
  }) => {
    return (
      <Container ref={refCb}>
        <Header title={title} />
        <div style={{ position: "relative", marginBottom: "20px" }}>
          <Carousel
            data={data}
            loading={isLoading}
            hasMore={hasNextPage}
            isFetching={isFetchingNextPage}
            fetchMore={fetchNextPage}
            {...props}
          >
            {children && children}
          </Carousel>
        </div>
        <Divider />
      </Container>
    );
  }
);

export default Wrapper;




export const SectionWrapper = ({
  query,
  children,
  variables,
  queryEnabled,
  whileInView,
  card,
  ...props
}) => {
  const {
    ref: inViewRef,
    inView,
    entry,
  } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const refCb=useCallback((node)=>{

    if(node){
      inViewRef(node)
    }
  },[inViewRef])

  
  const useQuery = useMemo(() => queryHandlers[query], [query]);
  
  const details=card==='detail'
  const fetchQuery = whileInView ? (!!queryEnabled && inView) : !!queryEnabled;
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    isLoading,
  } = useQuery({
    ...variables,
    withImages: details,
    queryOptions: { enabled: !!fetchQuery },
  });

  const movies = useMemo(() => {
    if (data) {
      var list = [];
      data.pages.forEach((page, i) => {
        const { data } = page[Object.keys(page)[0]];
        list = [...list, ...data];
      });
      return list;
    }
    return [];
  }, [data]);

  return (
    <Wrapper
      {...{
        data: movies,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        isLoading,
        status,
      }}
      refCb={refCb}
      card={card}
      {...(details && { slidesPerView: "auto" })}
      {...props}
    >
      {children && children}
    </Wrapper>
  );
};

export const Section = memo((props) => {
  return (
    <ErrorBoundary
      fallbackRender={({ resetErrorBoundary, error }) => {
        return (
          <div>
            There was an error!
            <button onClick={() => resetErrorBoundary()}>Try again</button>
          </div>
        );
      }}
    >
      <SectionWrapper {...props} />
    </ErrorBoundary>
  );
});


