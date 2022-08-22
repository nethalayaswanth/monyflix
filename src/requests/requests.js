import { useQuery, useInfiniteQuery } from "react-query";
import { GraphQLClient, gql } from "graphql-request";

import {
  seriesList,
  MovieGenre,
  trendingMovies,
  latestMovie,
  SimilarMovies,
  Movies,
  videosById,
  Movie,
} from "./queries";

const endpoint = "http://localhost:4001/";

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    "Content-Type": "application/json",
  },
});

export function useGetMovies({ type }) {
  return useInfiniteQuery(
    ["getMovies", type],
    async ({ pageParam = 0 }) => {
      const data = await graphQLClient.request(Movies, {
        type,
        after: pageParam,
      });
      return data;
    },
    {
      getNextPageParam: ({ movies: { cursor, hasMore } }, pages) => {
        return hasMore ? cursor : undefined;
      },
    }
  );
}

export function useGetSimilarMovies({ id }) {
  return useInfiniteQuery(
    ["getSimilarMovies", id],
    async ({ pageParam = 0 }) => {
      const data = await graphQLClient.request(SimilarMovies, {
        id,
        after: pageParam,
      });
      return data;
    },
    {
      getNextPageParam: ({ similarMovies: { cursor, hasMore } }, pages) => {
        return hasMore ? cursor : undefined;
      },
    }
  );
}
export function useGetMoviesByGenre({ genres }) {
  return useInfiniteQuery(
    ["getMoviesByGenre", genres],
    async ({ pageParam = 0 }) => {
      const data = await graphQLClient.request(MovieGenre, {
        genres,
        after: pageParam,
      });
      return data;
    },
    {
      getNextPageParam: (data, pages) => {
        if (data) {
          const {
            MovieGenre: { cursor, hasMore },
          } = data;

          return hasMore ? cursor : undefined;
        }
        return undefined;
      },
    }
  );
}
export function useGetLatestMovie() {
  return useQuery(["latestMovie"], async () => {
    const data = await graphQLClient.request(latestMovie);
    return data;
  });
}

export function useGetVideosById({ id, types }) {
  const include = types.reduce((x, y) => {
    x[y.toLowerCase()] = true;
    return x;
  }, {});
  return useQuery(["videos", id, types], async () => {
    const data = await graphQLClient.request(videosById, {
      types,
      id,
      ...include,
    });
    return data;
  });
}

export const getMovieDetails = async ({ id }) => {
  const data = await graphQLClient.request(Movie, {
    id,
  });

  return data;
};

export function useMovieDetails({ id, ...args }) {
  return useQuery(
    ["movie", id],
    async () => {
      const data = await graphQLClient.request(Movie, {
        id,
      });

      return data;
    },
    { ...args }
  );
}
