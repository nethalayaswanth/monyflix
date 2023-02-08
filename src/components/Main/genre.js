import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useMoviesByGenre } from "../../requests/requests";
import Grid from "./grid";

export default function Genre() {
  const { genreId } = useParams();

  const { data, fetchNextPage, hasNextPage, isFetching,isLoading,status, isFetchingNextPage } =
    useMoviesByGenre({ genreIds: [parseInt(genreId)], size: 20 });
  const movies = useMemo(() => {
    if (data) {
      var list = [];
      data.pages.forEach(({ data }, i) => {
        list = [...list, ...data];
      });
      return list;
    }
    return [];
  }, [data]);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, []);

  const props = {
    data: movies,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
  };

  return <Grid {...props} />;
}
