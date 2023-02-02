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
    landscapePosterPath @include(if: $withLandscapePosterPath)

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
    $size: Int
    $page: Int
    $withVideo: Boolean = true
    $videoTypes: [VideoType] = [CLIP, TRAILER, TEASER]
    $withLandscapePosterPath: Boolean = false
  ) {
    MovieGenre(genres: $genres, after: $after, size: $size, page: $page) {
      data {
        ...CoreMovieFields
      }
      cursor
      hasMore
      nextPage
    }
  }
`;

export const Movies = gql`
  ${CORE_MOVIE_FIELDS}
  query Movies(
    $type: MoviesType!
    $after: Int
    $size: Int
    $page: Int
    $withVideo: Boolean = false
    $videoTypes: [VideoType] = [CLIP]
    $withLandscapePosterPath: Boolean = false
  ) {
    movies(type: $type, after: $after, size: $size, page: $page) {
      data {
        ...CoreMovieFields
      }
      cursor
      hasMore
    }
  }
`;

export const Search = gql`
  ${CORE_MOVIE_FIELDS}
  query Search(
    $key: String!
    $after: Int
    $size: Int
    $page: Int
    $withVideo: Boolean = false
    $videoTypes: [VideoType] = [CLIP, TRAILER, TEASER]
    $withLandscapePosterPath: Boolean = false
  ) {
    search(key: $key, after: $after, size: $size, page: $page) {
      data {
        ...CoreMovieFields
      }
      cursor
      hasMore
      nextPage
    }
  }
`;
export const Movie = gql`
  ${CORE_MOVIE_FIELDS}
  query Query(
    $id: ID!
    $videoTypes: [VideoType] = [CLIP, TRAILER, TEASER]
    $withVideo: Boolean = true
    $withLandscapePosterPath: Boolean = false
  ) {
    movie(id: $id) {
      ...CoreMovieFields
      runtime
      genres{
id,name
      }
      tagline
    }
  }
`;

export const similarMovies = gql`
  ${CORE_MOVIE_FIELDS}
  query similarMovies(
    $id: ID!
    $size: Int
    $after: Int
    $page: Int
    $withVideo: Boolean = false
    $videoTypes: [VideoType] = [CLIP]
    $withLandscapePosterPath: Boolean = false
  ) {
    similarMovies(id: $id, after: $after, size: $size, page: $page) {
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
    $size: Int
    $after: Int
    $page: Int
    $withVideo: Boolean = false
    $videoTypes: [VideoType] = [CLIP]
    $withLandscapePosterPath: Boolean = false
  ) {
    recommendedMovies(id: $id, after: $after, size: $size, page: $page) {
      data {
        ...CoreMovieFields
      }
      cursor
      hasMore
    }
  }
`;


export const latestMovie = gql`
  ${CORE_MOVIE_FIELDS}
  query latestMovie(
    $withVideo: Boolean = false
    $videoTypes: [VideoType] = [CLIP, TRAILER, TEASER]
    $withLandscapePosterPath: Boolean = true
  ) {
    latestMovie {
      ...CoreMovieFields 
    }
  }
`;

export const trendingMovies = gql`
  ${CORE_MOVIE_FIELDS}
  query trendingMovies(
    $after: Int
    $size: Int
    $page: Int
    $withVideo: Boolean = false
    $withLandscapePosterPath: Boolean = false
    $videoTypes: [VideoType] = [CLIP, TRAILER, TEASER]
  ) {
    trendingMovies(after: $after, size: $size, page: $page) {
      data {
        ...CoreMovieFields
      }
      cursor
      hasMore
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
  Search,
};

export default queries;
