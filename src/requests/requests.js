import { GraphQLClient } from "graphql-request";
import { useInfiniteQuery, useQuery } from "react-query";

import {
  latestMovie, Movie, MovieGenre, Movies, recommendedMovies, similarMovies, videosById
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
      const data = await graphQLClient.request(similarMovies, {
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
export function useGetRecommendedMovies({ id }) {
  return useInfiniteQuery(
    ["getRecommendedMovies", id],
    async ({ pageParam = 0 }) => {
      const data = await graphQLClient.request(recommendedMovies, {
        id,
        after: pageParam,
      });
      return data;
    },
    {
      getNextPageParam: ({ recommendedMovies: { cursor, hasMore } }, pages) => {
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
    Horror: 27,
    Thriller: 53,
    Mystery: 9648,
    Adventure: 12,
    Fantasy: 14,
    Crime: 80,
    ScienceFiction: 878,
    Family: 10751,
    History: 36,
    War: 10752,
    Western:37,
    Documentary:99
  };

  let A = [];

  genres.forEach((x) => {
    A.push(`${Id[x]}`);
  });
 
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

export const getVideosById = async ({ id, types }) => {
  const include = types.reduce((x, y) => {
    x[y.toLowerCase()] = true;
    return x;
  }, {});

  const data = await graphQLClient.request(videosById, {
    types,
    id,
    ...include,
  });
  return data;
};

export function useGetVideosById({ id, types }) {
  return useQuery(["videos", id, types], () => getVideosById({ id, types }));
}

export const getMovieDetails = async ({ id }) => {
  const data = await graphQLClient.request(Movie, {
    id,
  });

  return data;
};

export function useMovieDetails({ id, ...args }) {
  return useQuery(["movie", id], () => getMovieDetails({ id }));
}
