
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
       data.pages.forEach(( { data  }, i) => {
         list = [...list, ...data];
       });
        return list;
     
     }
     return [];
   }, [recommendedMoviesQuery?.data]);

  

   return (
     <>
       {opened && recommendedMovies && recommendedMovies.length !== 0 && (
         <Section
           title="Recommended Movies"
           data={recommendedMovies}
           loading={recommendedMoviesQuery.status === "loading"}
           hasMore={recommendedMoviesQuery.hasNextPage && renderFullList}
           isFetching={recommendedMoviesQuery.isFetchingNextPage}
           fetchMore={recommendedMoviesQuery.fetchNextPage}
           card="potrait"
           cardExpand={false}
           cardHover={false}
           breakPointValues={[2, 2, 3, 4, 4, 5]}
         ></Section>
       )}
     </>
   );
 };

export default RecommendedMovies;