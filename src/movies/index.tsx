import { CircularProgress } from "@mui/material";
import { CSSProperties, useEffect } from "react";
import { FC, useCallback, useState } from "react";
import { useMovies } from "../hooks/useMovies";
import { columnFill, flexFill } from "../style";
import { List } from "./list";
import AutoSizer from "react-virtualized-auto-sizer";
import { ComboBox } from "./search";
import { Item } from "./list/item";

const style = {
  searchContainer: { display: "flex", padding: "10px 0" } as CSSProperties,
};

export const Movies: FC = () => {
  const [limit, setLimit] = useState<number>(20);
  const [search, setSearch] = useState("");

  const { data: { items, total }, isLoading } = useMovies({
    sort: "ratings.imdb",
    search,
    limit,
  });

  useEffect(() => {
    setLimit(20);
  }, [search]);

  const loadMoreItems = useCallback(
    (_startIndex: number, stopIndex: number) => {
      setLimit(stopIndex);
    },
    []
  );

  const renderGrid = useCallback(
    ({ width, height }: { width: number; height: number }) =>
      isLoading ? (
        <CircularProgress />
      ) : (
        <List
          loadMoreItems={loadMoreItems}
          items={items}
          width={width}
          height={height}
          count={total}
        >{Item}</List>
      ),
    [items, total, isLoading, loadMoreItems]
  );

  return (
    <div style={columnFill}>
      <div style={style.searchContainer}>
        <ComboBox
          onChange={(keyword) => {
            setSearch(keyword || "");
          }}
        />
      </div>
      <div style={flexFill}>
        <AutoSizer>{renderGrid}</AutoSizer>
      </div>
    </div>
  );
};

// Movies.whyDidYouRender = {
//   logOnDifferentValues: true,
// };
