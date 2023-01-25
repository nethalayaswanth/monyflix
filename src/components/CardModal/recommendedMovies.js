
import { useMemo } from "react";
import {
  useRecommendedMovies,

} from "../../requests/requests";

import Section from "../Section";

 const RecommendedMovies = ({ movieId, opened, renderFullList }) => {
   const recommendedMoviesQuery = useRecommendedMovies({
     id: movieId,
     size: 4,
     queryOptions: {
       enabled: !!movieId, 
       keepPreviousData: true,
     },
   });

   const recommendedMovies = useMemo(() => {
     const data = recommendedMoviesQuery?.data;
     if (data) {
       var list = [];
       data.pages.forEach(({ recommendedMovies: { data } }, i) => {
         list = [...list, ...data];
       });
       if (renderFullList) return list;
       return list.slice(0, 2);
     }
     return [];
   }, [recommendedMoviesQuery?.data, renderFullList]);

   return (
     <>
       {opened && recommendedMovies && (
         <Section
           title="More Like This"
           data={recommendedMovies}
           loading={recommendedMoviesQuery.status === "loading"}
           hasMore={recommendedMoviesQuery.hasNextPage && renderFullList}
           isFetching={recommendedMoviesQuery.isFetchingNextPage}
           fetchMore={recommendedMoviesQuery.fetchNextPage}
           card="card"
           breakPointValues={[5, 5, 4, 4, 3, 2]}
         ></Section>
       )}
     </>
   );
 };

export default RecommendedMovies;