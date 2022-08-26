import React, { memo, useMemo } from "react";
import styled from "styled-components";
import { useGetMoviesByGenre, useGetMovies } from "../../requests/requests";
import Card from "../Card";
import Carousel from "../Carousel";
import DetailsCard from "../DetailsCard";
import Divider from "../Divider";
import Header from "../Header";
import LandscapeCard from "../landscapeCard";

const Container = styled.div`
  width: 100%;
  padding: 0;
  z-index: 1;

  .swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 220px;

    @media only screen and (min-width: 740px) {
      width: calc((100% - 2 * 10px) / 3);
    }
    @media only screen and (min-width: 1320px) {
      width: calc((100% - 4 * 10px) / 5);
    }
  }
`;

function useFetch({ genres }) {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useGetMoviesByGenre({ genres });

  const movies = useMemo(() => {
    if (data) {
      var list = [];

      data.pages.forEach(({ MovieGenre: { data } }, i) => {
        list = [...list, ...data];
      });

      return list;
    }
    return [];
  }, [data]);

  const isLoading = status === "loading";

  return {
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isFetchingNextPage,
    status,
    movies,
  };
}
export function Index({
  movies,
  fetchNextPage,
  hasNextPage,
  isFetching,
  isFetchingNextPage,
  status,
  title,
  children,
  isLoading,
  ...props
}) {
  return (
    <Container>
      <Header title={title} />
      <Carousel
        data={movies}
        loading={isLoading || status === "loading"}
        hasMore={hasNextPage}
        isFetching={isFetchingNextPage}
        fetchMore={fetchNextPage}
        {...props}
      >
        {children && children}
      </Carousel>
      <Divider />
    </Container>
  );
}

const Section = memo(Index);
export default Section;

export const LandScapeSection = memo(({ genres, ...props }) => {
  const data = useFetch({ genres: genres });
  return (
    <Section slidesPerView={1} {...data} {...props}>
      <LandscapeCard />
    </Section>
  );
});

export const DetailsSection = memo(({ genres, ...props }) => {
  const data = useFetch({ genres: genres });
  return (
    <Section slidesPerView={"auto"} {...data} {...props}>
      <DetailsCard />
    </Section>
  );
});

export const ExpandCardGenreSection = memo(({ genres, ...props }) => {
  const data = useFetch({ genres: genres });
  return (
    <Section {...data} {...props}>
      <Card />
    </Section>
  );
});

export const ExpandCardSection = memo(
  ({ query, children, details, ...props }) => {

    
    const {
      data,
      error,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isFetchingNextPage,
      status,
    } = useGetMovies({ type: query, withImages: details });

    const movies = useMemo(() => {
      if (data) {
        var list = [];

        data.pages.forEach(({ movies: { data } }, i) => {
          list = [...list, ...data];
        });

        return list;
      }
      return [];
    }, [data]);

    return (
      <Section
        {...{
          movies,
          error,
          fetchNextPage,
          hasNextPage,
          isFetching,
          isFetchingNextPage,
          status,
        }}
        {...(details && { slidesPerView: "auto" })}
        {...props}
      >
        {children && children}
      </Section>
    );
  }
);

