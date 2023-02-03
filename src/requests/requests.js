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
  videosById,
  Search,
} from "./queries";
export const GenreIds = {
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

export const getGenreIds = (genres) =>genres.map((genre) => GenreIds[genre]?`${GenreIds[genre]}`:null).filter((x) => !!x);

const getNextPageParam=(data, pages) => {
        if (data) {
          const { cursor, hasMore, nextPage } = data;

          return hasMore
            ? { cursor, page: nextPage - 1 }
            : !!nextPage
            ? { cursor: 0, page: nextPage }
            : undefined;
        }
        return undefined;
      }
   
const endpoint ='https://movies-server-eta.vercel.app'

//  const endpoint= process.env.NODE_ENV !== "production"
//     ? `${process.env.REACT_APP_BASE_ENDPOINT_LOCAL}`
//     : `${process.env.REACT_APP_BASE_ENDPOINT}`;

       console.log(process.env.NODE_ENV,endpoint);

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    "Content-Type": "application/json",
  },
});

export function useMovies({
  type,
  size,
  withLandscapePosterPath,
  queryOptions,
}) {
  return useInfiniteQuery(
    ["movies", type],
    async ({ pageParam = 0 }) => {
      const { movies: data } = await graphQLClient.request(Movies, {
        type,
        after: pageParam,
        withLandscapePosterPath,
        size,
      });

      return data;
    },
    {
      ...(queryOptions && queryOptions),
      getNextPageParam: ({ cursor, hasMore }, pages) => {
        return hasMore ? cursor : undefined;
      },
    }
  );
}

export function useSearch({
  key,
  size,
  withLandscapePosterPath,
  queryOptions,
}) {
  return useInfiniteQuery(
    ["search", key],
    async ({ pageParam = { cursor: 0, page: 1 } }) => {
      const { search } = await graphQLClient.request(Search, {
        key,
        after: pageParam.cursor,
        withLandscapePosterPath,
        size,
        page: pageParam.page,
      });

      console.log(search)
      return search;
    },
    {
      ...(queryOptions && queryOptions),
      getNextPageParam
    }
  );
}

export function useSimilarMovies({ id, size, queryOptions }) {
  return useInfiniteQuery(
    ["similarMovies", id],
    async ({ pageParam = 0 }) => {
      const { similarMovies: data } = await graphQLClient.request(
        similarMovies,
        {
          id,
          after: pageParam,
          size,
        }
      );
      return data;
    },
    {
      ...(queryOptions && queryOptions),
      getNextPageParam: ({ cursor, hasMore }, pages) => {
        return hasMore ? cursor : undefined;
      },
    }
  );
}
export function useRecommendedMovies({ id, size, queryOptions }) {
  return useInfiniteQuery(
    ["recommendedMovies", id],
    async ({ pageParam = 0 }) => {
      const { recommendedMovies: data } = await graphQLClient.request(
        recommendedMovies,
        {
          id,
          after: pageParam,
          size,
        }
      );
      return data;
    },
    {
      ...(queryOptions && queryOptions),
      getNextPageParam: ({ cursor, hasMore }, pages) => {
        return hasMore ? cursor : undefined;
      },
    }
  );
}
export function useMoviesByGenre({
  genres,
  genreIds,
  queryOptions,
  size,
  withLandscapePosterPath = false,
}) {

  const ids = genreIds ?? getGenreIds(genres)
  

  return useInfiniteQuery(
    ["moviesByGenre", ...ids],
    async ({ pageParam = { cursor: 0, page: 1 } }) => {
      const { MovieGenre: data } = await graphQLClient.request(MovieGenre, {
        genres:ids,
        after: pageParam.cursor,
        withLandscapePosterPath,
        size,
        page: pageParam.page,
      });
      console.log(data, genres);
      return data;
    },
    {
      ...(queryOptions && queryOptions),
      getNextPageParam,
    }
  );
}
export function useLatestMovie({ queryOptions }) {
  return useQuery(
    ["latestMovie"],
    async () => {
      const { latestMovie: data } = await graphQLClient.request(latestMovie);
      return data;
    },
    { ...(queryOptions && queryOptions) }
  );
}

export function useTrendingMovies({
  type,
  withLandscapePosterPath,
  size,
  queryOptions,
}) {
  return useInfiniteQuery(
    ["trendingMovies"],
    async ({ pageParam = 0 }) => {
      const { trendingMovies:data } = await graphQLClient.request(
        trendingMovies,
        {
          type,
          after: pageParam,
          withLandscapePosterPath,
          size,
        }
      );
      return data;
    },
    {
      ...(queryOptions && queryOptions),
      getNextPageParam: ({ cursor, hasMore}, pages) => {
        return hasMore ? cursor : undefined;
      },
    }
  );
}

export const getVideosById = async ({ id, types, size }) => {
  try {
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
  } catch (e) {
    throw e;
  }
};

export function useVideosById({ id, types, size, queryOptions }) {
  return useQuery(
    ["videos", id, types],
    () => getVideosById({ id, types, size }),
    { ...(queryOptions && queryOptions) }
  );
}

export const getMovieDetails = async ({ id }) => {
  try {
    const data = await graphQLClient.request(Movie, {
      id,
    });
    return data;
  } catch (e) {
    throw e;
  }
};

export function useMovieDetails({ id, queryOptions }) {
  return useQuery(["movie", id], () => getMovieDetails({ id }), {
    onError: (err) => {},
    ...(queryOptions && queryOptions),
  });
}
