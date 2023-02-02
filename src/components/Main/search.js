import { useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useParamState } from "../../contexts/paramContext";
import { useSearch } from "../../requests/requests";
import LandscapeCard from "../Cards/landscapeCard";
import debounce from "lodash/debounce";

import Grid from "./grid";
export default function Search() {
  const [searchParams, setSearchParams] = useParamState();

  const key = searchParams.get("q");
  const [queryKey, setQueryKey] = useState(key);

  const keyRef = useRef();
  keyRef.current = key;

  const debounceFn = useMemo(
    () => debounce(() => setQueryKey(keyRef.current), 400),
    []
  );

  if (key !== queryKey) {
    debounceFn();
  }
  console.log(queryKey)

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useSearch({ key: queryKey, queryOptions: { keepPreviousData: true,enabled:queryKey&& queryKey.length!==0 } });

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
