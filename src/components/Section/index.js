import React, { useMemo } from "react";
import styled from "styled-components";
import { useGetMovies } from "../../requests/requests";
import Carousel from "../Carousel";
import Divider from "../Divider";
import Header from "../Header";

const Container = styled.div`
  width: 100%;
  padding: 0;
  z-index: 1;
`;

export default function Section({ query, title, children, withImages }) {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useGetMovies({ type: query, withImages });

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
    <Container>
      <Header title={title} />
      <Carousel
        data={movies}
        loading={status === "loading"}
        hasMore={hasNextPage}
        isFetching={isFetchingNextPage}
        fetchMore={fetchNextPage}
      >
        {children && children}
      </Carousel>
      <Divider />
    </Container>
  );
}
