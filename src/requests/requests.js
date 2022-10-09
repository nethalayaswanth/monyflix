import { GraphQLClient } from "graphql-request";
import { useInfiniteQuery, useQuery } from "react-query";

import {
  latestMovie,
  Movie,
  MovieGenre,
  Movies,
  recommendedMovies,
  similarMovies,
  trendingMovies,
  videosById
} from "./queries";

const endpoint =
  process.env.NODE_ENV !== "production"
    ? `${process.env.REACT_APP_BASE_ENDPOINT}`
    : `${process.env.REACT_APP_BASE_ENDPOINT}`;

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    "Content-Type": "application/json",
  },
});

export function useMovies({ type, withImages, queryOptions }) {
  return useInfiniteQuery(
    ["movies", type],
    async ({ pageParam = 0 }) => {
      const data = await graphQLClient.request(Movies, {
        type,
        after: pageParam,
        withImages,
      });
      return data;
    },
    {
      ...(queryOptions && queryOptions),
      getNextPageParam: ({ movies: { cursor, hasMore } }, pages) => {
        return hasMore ? cursor : undefined;
      },
    }
  );
}

export function useGetSimilarMovies({ id, size ,queryOptions}) {
  return useInfiniteQuery(
    ["similarMovies", id],
    async ({ pageParam = 0 }) => {
      const data = await graphQLClient.request(similarMovies, {
        id,
        after: pageParam,
        size,
      });
      return data;
    },
    {
      ...(queryOptions && queryOptions),
      getNextPageParam: ({ similarMovies: { cursor, hasMore } }, pages) => {
        return hasMore ? cursor : undefined;
      },
    }
  );
}
export function useGetRecommendedMovies({ id, size, queryOptions }) {
  return useInfiniteQuery(
    ["recommendedMovies", id],
    async ({ pageParam = 0 }) => {
      const data = await graphQLClient.request(recommendedMovies, {
        id,
        after: pageParam,
        size,
      });
      return data;
    },
    {
      ...(queryOptions && queryOptions),
      getNextPageParam: ({ recommendedMovies: { cursor, hasMore } }, pages) => {
        return hasMore ? cursor : undefined;
      },
    }
  );
}
export function useMoviesByGenre({ genres, queryOptions }) {
  const ids = {
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
    Western: 37,
    Documentary: 99,
  };

 



 const genreIds = genres.map((genre) => `${ids[genre]}`);

 

  return useInfiniteQuery(
    ["moviesByGenre", ...genres],
    async ({ pageParam = 0 }) => {
      const data = await graphQLClient.request(MovieGenre, {
        genres: genreIds,
        after: pageParam,
      });
      return data;
    },
    {
      ...(queryOptions && queryOptions),
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
export function useLatestMovie({queryOptions}) {
  return useQuery(
    ["latestMovie"],
    async () => {
      const data = await graphQLClient.request(latestMovie);
      return data;
    },
    { ...queryOptions&&queryOptions }
  );
}

export function useTrendingMovies({ type, withImages, size,queryOptions }) {
  return useInfiniteQuery(
    ["trendingMovies"],
    async ({ pageParam = 0 }) => {
      const data = await graphQLClient.request(trendingMovies, {
        type,
        after: pageParam,
        withImages,
      });
      return data;
    },
    { 
      ...queryOptions&&queryOptions,
      getNextPageParam: ({ trendingMovies: { cursor, hasMore } }, pages) => {
        return hasMore ? cursor : undefined;
      },
    }
  );
}

export const getVideosById = async ({ id, types, size ,}) => {
  const include = types.reduce((x, y) => {
    x[y.toLowerCase()] = true;
    return x;
  }, {});

  const data = await graphQLClient.request(videosById, {
    types,
    size,
    id,
    ...include,
  });
  return data;
};

export function useGetVideosById({ id, types, size, queryOptions }) {
  return useQuery(
    ["videos", id, types],
    () => getVideosById({ id, types, size }),
    { ...(queryOptions && queryOptions) }
  );
}

export const getMovieDetails = async ({ id }) => {
  const data = await graphQLClient.request(Movie, {
    id,
  });

  return data;
};

export function useMovieDetails({id,queryOptions}) {
  return useQuery(["movie", id], () => getMovieDetails({ id }), {
    ...(queryOptions && queryOptions),
  });
}
