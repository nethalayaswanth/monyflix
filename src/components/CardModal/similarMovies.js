
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
      data.pages.forEach(({ data }, i) => {
        list = [...list, ...data];
      });
       return list;
      
    }
    return [];
  }, [similarMoviesQuery?.data]);

  return (
    <>
      {opened && similarMovies && similarMovies.length !== 0 && (
        <Section
          title="More Like This"
          data={similarMovies}
          loading={similarMoviesQuery.status === "loading"}
          hasMore={similarMoviesQuery.hasNextPage && renderFullList}
          isFetching={similarMoviesQuery.isFetchingNextPage}
          fetchMore={similarMoviesQuery.fetchNextPage}
          card="detail"
          cardExpand={false}
          cardHover={false}
         
          breakPointValues={[1.5, 1.75, 3, 3, 3, 3]}
        ></Section>
      )}
    </>
  );
};


export default SimilarMovies;