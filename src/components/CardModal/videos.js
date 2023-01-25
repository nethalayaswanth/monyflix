import { useMemo } from "react";
import {
  useGetRecommendedMovies,
  useGetSimilarMovies,
  useVideosById,
  useMovieDetails,
} from "../../requests/requests";

import Section from "../Section";

 const Videos = ({ movieId, opened, renderFullList }) => {
  const {
    isLoading,
    error: videoError,
    data: videoData,
    isFetching: videoFetching,
  } = useVideosById({
    id: movieId,
    types: ["CLIP", "TRAILER", "BLOOPERS", "TEASER", "BTS", "FEATURETTE"],
    queryOptions: {
      enabled: !!movieId,
      keepPreviousData: true,
    },
  });


  const videos = useMemo(() => {
    const videos = videoData?.videosById;
    if (!videos) return;
    const clips = {
      data: renderFullList ? videos.clip : videos.clip.slice(0, 1),
      title: "Clips",
      breakPointValues: [3, 3, 3, 3, 3, 1],
    };
    const trailers = {
      data: renderFullList ? videos.trailer : videos.trailer.slice(0, 1),
      title: "Trailers",
      breakPointValues: [4, 4, 3, 3, 3, 2],
    };
    const teasers = {
      data: renderFullList ? videos.teaser : videos.teaser.slice(0, 1),
      title: "Teasers",
      breakPointValues: [4, 4, 3, 3, 3, 2],
    };
    const bts = {
      data: renderFullList ? videos.bts : videos.bts.slice(0, 1),
      title: "Behind The Scenes",
      breakPointValues: [4, 4, 3, 3, 3, 2],
    };
    const featurette = {
      data: renderFullList ? videos.featurette : videos.featurette.slice(0, 1),
      title: "Featurette",
      breakPointValues: [4, 4, 3, 3, 3, 2],
    };
    const bloopers = {
      data: renderFullList ? videos.bloopers : videos.bloopers.slice(0, 1),
      title: "Bloopers",
      breakPointValues: [4, 4, 3, 3, 3, 2],
    };

    return [clips, trailers, teasers, bts, featurette, bloopers];
  }, [renderFullList, videoData]);


  return (
    <>
      {opened && videoData && videos && (
        <>
          {videos.map((type, i) => {
            if (type.data.length === 0) return null;

            return (
              <Section
                key={i}
                data={type.data}
                title={type.title}
                card="thumbnail"
                breakPointValues={type.breakPointValues}
              />
            );
          })}
        </>
      )}
    </>
  );
};


export default Videos