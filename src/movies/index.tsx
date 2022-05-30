import { CircularProgress } from "@mui/material";
import { CSSProperties, useEffect } from "react";
import { FC, useCallback, useState } from "react";
import { Movie, useMovies } from "../hooks/useMovies";
import { columnFill, flexFill } from "../style";
import { List } from "./list";
import AutoSizer from "react-virtualized-auto-sizer";
import { ComboBox } from "./search";

const ITEMS_PLACEHOLDER = {
  items: [] as Movie[],
  total: 0
};

const style = {
  searchContainer: { display: "flex", padding: "10px 0" } as CSSProperties,
};

export const Movies: FC = () => {
  const [limit, setLimit] = useState<number>(20);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useMovies({
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
        <AutoSizer>
          {({ width, height }: { width: number; height: number }) =>
            isLoading ? (
              <CircularProgress />
            ) : (
              <List
                loadMoreItems={loadMoreItems}
                items={data || ITEMS_PLACEHOLDER}
                width={width}
                height={height}
              />
            )
          }
        </AutoSizer>
      </div>
    </div>
  );
};

// Movies.whyDidYouRender = {
//   logOnDifferentValues: true,
// };
