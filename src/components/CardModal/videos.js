import { useMemo } from "react";
import {
  useGetRecommendedMovies,
  useGetSimilarMovies,
  useVideosById,
  useMovieDetails,
} from "../../requests/requests";

import Section from "../Section";

 const Videos = ({ movieId, opened, initialData }) => {
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
      refetchOnMount:false
    },
  });


  const videos = useMemo(() => {
    const videos = videoData?.videosById ?? initialData;
    if (!videos) return;
    const clips = {
      data:  videos.clip ,
      title: "Clips",
      breakPointValues: [1, 1, 1.5,2, 2,2],
    };
    const trailers = {
      data: videos.trailer,
      title: "Trailers",
      breakPointValues: [2, 2, 3, 4, 4,3],
    };
    const teasers = {
      data: videos.teaser ,
      title: "Teasers",
      breakPointValues: [3, 3, 4, 4, 4, 4],
    };
    const bts = {
      data: videos.bts ,
      title: "Behind The Scenes",
      breakPointValues: [3, 3, 4, 4, 4, 4],
    };
    const featurette = {
      data:  videos.featurette ,
      title: "Featurette",
      breakPointValues: [2, 2, 3, 3, 3, 3],
    };
    const bloopers = {
      data:  videos.bloopers ,
      title: "Bloopers",
      breakPointValues: [3, 3, 4, 4, 4, 4],
    };

    return [clips, trailers, teasers, bts, featurette, bloopers];
  }, [initialData, videoData?.videosById]);

  
  return (
    <>
      {opened  && videos && (
        <>
          {videos.map((type, i) => {
            if (!type.data || type.data.length === 0) return null;

            return (
              <Section
                key={i}
                data={type.data}
                title={type.title}
                card="thumbnail"
                cardExpand={false}
                cardHover={false}
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