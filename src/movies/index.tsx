import { FC, useCallback, useState } from "react";
import { Sort, useMovies } from "../hooks/useMovies";
import { List } from "./list";
import { Item } from "./list/item";
import { ComboBox } from "./search";

export const Movies: FC = () => {
  const [page, setPage] = useState<number>(1);
  const [sort, setSort] = useState("ratings.imdb" as Sort);
  const [search, setSearch] = useState("");

  const { data, isFetching } = useMovies({
    sort,
    search,
    limit: page * 20,
  });

  const loadNextPage = useCallback(() => setPage(page + 1), [page]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div
        style={{ display: "flex", padding: '10px 0' }}
      >
        <ComboBox onChange={(keyword) => setSearch(keyword || '')} />
      </div>
      <div style={{ flex: 1 }}>
        <List
          loadNextPage={loadNextPage}
          isLoading={isFetching}
          hasNextPage={data ? data.total > data.items.length : true}
          items={data?.items || []}
        >
          {Item}
        </List>
      </div>
    </div>
  );
};
