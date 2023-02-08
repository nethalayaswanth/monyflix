import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useMovies } from "../../requests/requests";
 
import Grid from "./grid";

export default function Discover() {
  const [searchParams, setSearchParams] = useSearchParams();

  const genreParams = searchParams.get("genres");
  const type = searchParams.get("type") ?? "Popular";
  const sortBy = searchParams.get("sortBy") ?? "Popularity";
  const genres = genreParams ? genreParams.split(",") : null;


  const { data, fetchNextPage, hasNextPage,isLoading, isFetching, isFetchingNextPage } =
    useMovies({ type,sortBy,genres, size: 20 });

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
    isLoading,
    isFetchingNextPage,
  };

  return <Grid {...props} />;
}
