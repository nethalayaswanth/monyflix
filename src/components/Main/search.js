import { useMemo } from "react";
import styled from "styled-components";
import { useParamState } from "../../contexts/paramContext";
import { useSearch } from "../../requests/requests";
import LandscapeCard from "../Cards/landscapeCard";

import Grid from "./grid";
export default function Search() {
  const [searchParams, setSearchParams] = useParamState();

  const key = searchParams.get("q");
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useSearch({ key, queryOptions: { keepPreviousData: true } });

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

  const props = {
    data: movies,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  };

  return <Grid {...props} />;
}
