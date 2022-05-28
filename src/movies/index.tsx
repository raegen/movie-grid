import { FC, useCallback, useState } from "react";
import { Sort, useMovies } from "../hooks/useMovies";
import { List } from "./list";
import { Item } from "./list/item";

export const Movies: FC<{search: string; sort: Sort}> = ({search, sort}) => {
  const [page, setPage] = useState<number>(1);
  
  const { data, isFetching } = useMovies({
    sort,
    search,
    limit: page * 20,
  });

  const loadNextPage = useCallback(() => setPage(page + 1), [page]);

  return (
    <List
      loadNextPage={loadNextPage}
      isLoading={isFetching}
      hasNextPage={data ? data.total > data.items.length : true}
      items={data?.items || []}
    >
      {Item}
    </List>
  );
};
