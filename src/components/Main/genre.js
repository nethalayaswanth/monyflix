import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useMoviesByGenre } from "../../requests/requests";
import Grid from "./grid";

export default function Genre() {
  const { genreId } = useParams();

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useMoviesByGenre({ genreIds: [genreId], size: 20 });

    console.log({ data, fetchNextPage, hasNextPage, isFetching})
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

  const props = { data:movies, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage };

  return <Grid {...props} />;
}
