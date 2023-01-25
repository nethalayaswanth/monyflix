


import { useMemo } from "react";
import { useMovieDetails } from "../../../requests/requests";




export const MovieDetails = ({ movieId }) => {
  const {
    data: movieDetails,
    isLoading: movieDetailsLoading,
    refetch: movieDetailsRefetch,
    status: movieDetailStatus,
    isFetching,
    error,
  } = useMovieDetails({
    id: movieId,
    queryOptions: {
      enabled: !!movieId,
      keepPreviousData: true,
    },
  });

  const videoId = useMemo(() => {
    if (!movieDetails) return null;
    const videos = movieDetails.movie.videos;
    if (!videos) return null;
    const clip = videos.clip[0];
    const trailer = videos.trailer[0];
    const teaser = videos.teaser[0];

    return clip ? clip.key : trailer ? trailer.key : teaser ? teaser.key : "";
  }, [movieDetails]);

  const current = movieDetails?.movie;
  const year = current?.releaseDate.split("-")[0];
  const genres = movieDetails?.movie.genres;
  const runTime = movieDetails?.movie.runtime;

  const posterPath = current?.posterPath
    ? `https://image.tmdb.org/t/p/original${current?.posterPath}`
    : null;
  const posterPathPreview = current?.posterPath
    ? `https://image.tmdb.org/t/p/w300${current?.posterPath}`
    : null;

  const backDropPath = current?.backdropPath
    ? `https://image.tmdb.org/t/p/original${current?.backdropPath}`
    : null;
  const backDropPathPreview = current?.backdropPath
    ? `https://image.tmdb.org/t/p/w300${current?.backdropPath}`
    : null;
  return null;
};