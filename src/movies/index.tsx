import { CircularProgress } from "@mui/material";
import { CSSProperties, useEffect, useMemo } from "react";
import { FC, useCallback, useState } from "react";
import { Movie, Sort, useMovies } from "../hooks/useMovies";
import { columnFill, flexFill } from "../style";
import { List } from "./list";
import { Item } from "./list/item";
import { ComboBox } from "./search";

const EMPTY_LIST = [] as Movie[];

const style = {
  searchContainer: { display: "flex", padding: "10px 0" } as CSSProperties,
};

export const Movies: FC = () => {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState('');

  const { data, isFetching, isLoading } = useMovies({
    sort: 'ratings.imdb',
    search,
    limit: page * 20,
  });

  const hasNextPage = useMemo(
    () => (data ? data.total > data.items.length : true),
    [data]
  );
  const items = useMemo(() => data?.items || EMPTY_LIST, [data]);

  useEffect(() => {
    setPage(1);
  }, [search])

  const loadNextPage = useCallback(() => setPage(page + 1), [page]);

  return (
    <div style={columnFill}>
      <div style={style.searchContainer}>
        <ComboBox onChange={(keyword) => {
          setSearch(keyword || '');
        }} />
      </div>
      <div style={flexFill}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <List
            loadNextPage={loadNextPage}
            isLoading={isFetching}
            hasNextPage={hasNextPage}
            items={items}
          >
            {Item}
          </List>
        )}
      </div>
    </div>
  );
};

// Movies.whyDidYouRender = {
//   logOnDifferentValues: true,
// };
