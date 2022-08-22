import React, { useRef, useState, useCallback,useMemo, useEffect } from "react";
import { GraphQLClient, gql } from "graphql-request";
import styled, { css } from "styled-components";
import { useQuery } from "@apollo/client";
import Header from "../Header";
import Divider from "../Divider";
import Carousel from "../Carousel";
import { useGetMovies } from "../../requests/requests";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

const Container = styled.div`
  width: 100%;
  padding: 0;
  z-index: 1;
`; 


export default function Section({query,title}){

const {
  data,
  error,
  fetchNextPage,
  hasNextPage,
  isFetching,
  isFetchingNextPage,
  status,
} = useGetMovies({ type: query });


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
        />
        <Divider />
      </Container>
    );
}
