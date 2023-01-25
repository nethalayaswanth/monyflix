
import { useMemo } from "react";
import {
 
  useSimilarMovies,

} from "../../requests/requests";

import Section from "../Section";

 const SimilarMovies = ({ movieId,opened, renderFullList }) => {
  const similarMoviesQuery = useSimilarMovies({
    id: movieId,
    size: 4,
    queryOptions: {
      enabled: !!movieId,
      keepPreviousData: true,
    },
  });

  const similarMovies = useMemo(() => {
    const data = similarMoviesQuery?.data;
    if (data) {
      var list = [];
      data.pages.forEach(({ similarMovies: { data } }, i) => {
        list = [...list, ...data];
      });
      if (renderFullList) return list;
      return list.slice(0, 2);
    }
    return [];
  }, [renderFullList, similarMoviesQuery?.data]);

  return (
    <>
      {opened && similarMovies && (
        <Section
          title="More Like This"
          data={similarMovies}
          loading={similarMoviesQuery.status === "loading"}
          hasMore={similarMoviesQuery.hasNextPage && renderFullList}
          isFetching={similarMoviesQuery.isFetchingNextPage}
          fetchMore={similarMoviesQuery.fetchNextPage}
          card="card"
          breakPointValues={[5, 5, 4, 4, 3, 2]}
        ></Section>
      )}
    </>
  );
};


export default SimilarMovies;