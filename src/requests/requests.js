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

const endpoint = "http://localhost:4000/";

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
  const Id = {
    Romance: 10749,
    Drama: 18,
    Music: 10402,
    Animation: 16,
    Comedy: 35,
    Action: 28,
    Horror: 21,
    Thriller: 53,
    Mystery: 9648,
    Adventure: 12,
    Fantasy: 14,
  };

  let A = [];

  genres.forEach((x) => {
    A.push(`${Id[x]}`);
  });
  console.log(A);
  return useInfiniteQuery(
    ["getMoviesByGenre", genres],
    async ({ pageParam = 0 }) => {
      const data = await graphQLClient.request(MovieGenre, {
        genres: A,
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
