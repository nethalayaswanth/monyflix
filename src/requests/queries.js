import { gql } from "graphql-request";

export const CORE_VIDEO_FIELDS = gql`
  fragment CoreVideoFields on Video {
    id
    key
    name
    official
  }
`;
export const CORE_MOVIE_FIELDS = gql`
  ${CORE_VIDEO_FIELDS}
  fragment CoreMovieFields on Movie {
    backdropPath
    posterPath
    id
    overview
    title
    adult
    popularity
    releaseDate

    videos(types: $videoTypes) @include(if: $withVideo) {
      clip {
        ...CoreVideoFields
      }
      trailer {
        ...CoreVideoFields
      }
      teaser {
        ...CoreVideoFields
      }
    }
  }
`;

   
   
   
   
   

   
   
   

export const MovieGenre = gql`
  ${CORE_MOVIE_FIELDS}
  query MovieGenre(
    $genres: [String]!
    $after: Int
    $withVideo: Boolean = true
    $videoTypes: [VideoType] = [CLIP, TRAILER, TEASER]
  ) {
    MovieGenre(genres: $genres, after: $after) {
      data {
        ...CoreMovieFields
        images{
          filePath
        }
      }
      cursor
      hasMore
    }
  }
`;

export const Movies = gql`
  ${CORE_MOVIE_FIELDS}
  query Movies(
    $type: MoviesType!
    $after: Int
    $withVideo: Boolean = false
    $videoTypes: [VideoType] = [CLIP]
  ) {
    movies(type: $type, after: $after) {
      data {
        ...CoreMovieFields
      }
      cursor
      hasMore
    }
  }
`;

export const Movie = gql`
  ${CORE_VIDEO_FIELDS}
  query Query(
    $id: ID!
    $videoTypes: [VideoType] = [CLIP, TRAILER, TEASER]
    $withVideo: Boolean = true
  ) {
    movie(id: $id) {
      tagline
      runtime
      genres
      backdropPath
      posterPath
      id
      overview
      title
      adult
      popularity
      releaseDate
      videos(types: $videoTypes) @include(if: $withVideo) {
        clip {
          ...CoreVideoFields
        }
        trailer {
          ...CoreVideoFields
        }
        teaser {
          ...CoreVideoFields
        }
      }
    }
  }
`;

export const similarMovies = gql`
  ${CORE_MOVIE_FIELDS}
  query similarMovies(
    $id: ID!
    $after: Int
    $withVideo: Boolean = false
    $videoTypes: [VideoType] = [CLIP]
  ) {
    similarMovies(id: $id, after: $after) {
      data {
        ...CoreMovieFields
      }
      cursor
      hasMore
    }
  }
`;
export const recommendedMovies = gql`
  ${CORE_MOVIE_FIELDS}
  query recommendedMovies(
    $id: ID!
    $after: Int
    $withVideo: Boolean = false
    $videoTypes: [VideoType] = [CLIP]
  ) {
    recommendedMovies(id: $id, after: $after) {
      data {
        ...CoreMovieFields
        images {
          filePath
        }
      }
      cursor
      hasMore
    }
  }
`;


export const latestMovie = gql`
  ${CORE_MOVIE_FIELDS}
  query latestMovie(
    $withVideo: Boolean = true
    $videoTypes: [VideoType] = [CLIP, TRAILER, TEASER]
  ) {
    latestMovie {
      ...CoreMovieFields
      images{
        filePath
      }
    }
  }
`;

export const trendingMovies = gql`
  ${CORE_MOVIE_FIELDS}
  query trendingMovies {
    trendingMovies {
      ...CoreMovieFields
    }
  }
`;

export const seriesList = gql`
  query seriesList {
    seriesList {
      backdropPath
      posterPath
      id
      title
    }
  }
`;

export const videosById = gql`
  ${CORE_VIDEO_FIELDS}
  query Query(
    $id: ID!
    $types: [VideoType]
    $clip: Boolean = false
    $trailer: Boolean = false
    $teaser: Boolean = false
    $bts: Boolean = false
    $featurette: Boolean = false
    $bloopers: Boolean = false
  ) {
    videosById(id: $id, types: $types) {
      clip @include(if: $clip) {
        ...CoreVideoFields
      }
      trailer @include(if: $trailer) {
        ...CoreVideoFields
      }
      teaser @include(if: $teaser) {
        ...CoreVideoFields
      }
      bts @include(if: $bts) {
        ...CoreVideoFields
      }
      featurette @include(if: $featurette) {
        ...CoreVideoFields
      }
      bloopers @include(if: $bloopers) {
        ...CoreVideoFields
      }
    }
  }
`;

const queries = {
  seriesList,
  MovieGenre,
  trendingMovies,
  latestMovie,
  Movies,
  videosById,
  similarMovies,
  recommendedMovies,
  Movie,
};

export default queries;
