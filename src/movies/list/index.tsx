import { CSSProperties, useEffect, useRef, useState } from "react";
import { FixedSizeGrid, GridOnItemsRenderedProps } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { Movie } from "../../hooks/useMovies";
import { Item } from "./item";

// const ITEM_WIDTH = 200;
// const ITEM_HEIGHT = 300;

const ARROWS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

export const List = ({
  items: {items, total},
  loadMoreItems,
  width,
  height,
}: {
  items: {
    items: Movie[];
    total: number;
  };
  height: number;
  width: number;
  loadMoreItems: (startIndex: number, stopIndex: number) => void;
}) => {
  const [selected, setSelected] = useState<number>(0);
  const grid = useRef<{ rows: number; columns: number }>({
    rows: 0,
    columns: 0,
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (ARROWS.includes(e.key)) {
        let index = selected;
        if (e.key === "ArrowUp") {
          index = selected - grid.current.columns;
        } else if (e.key === "ArrowDown") {
          index = selected + grid.current.columns;
        } else if (e.key === "ArrowLeft") {
          index = selected - 1;
        } else if (e.key === "ArrowRight") {
          index = selected + 1;
        }

        if (items[index]) {
          setSelected(index);
        }
      }
    };

    document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);
  }, [selected, items]);

  const itemCount = items.length;
  const isItemLoaded = (index: number) => !!items[index];

  const cols = Math.floor(width / 200);
  const rows = Math.ceil(itemCount / cols);
  const itemWidth = width / cols;
  const itemHeight = itemWidth * 1.5;

  grid.current = {
    rows: rows,
    columns: cols,
  };

  const getIndex = ({
    rowIndex,
    columnIndex,
  }: {
    rowIndex: number;
    columnIndex: number;
  }) => rowIndex * cols + columnIndex;

  return (
    <div style={{ display: "flex", width, height, justifyContent: "center" }}>
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={total}
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered, ref }) => (
          <FixedSizeGrid
            columnCount={cols}
            columnWidth={itemWidth}
            height={height}
            rowCount={rows}
            rowHeight={itemHeight}
            // itemKey={(params: {
            //   columnIndex: number;
            //   rowIndex: number;
            //   data: T;
            // }) => items[getIndex(params)].id}
            width={width}
            onItemsRendered={({
              overscanRowStartIndex,
              overscanColumnStartIndex,
              overscanRowStopIndex,
              overscanColumnStopIndex,
              visibleRowStartIndex,
              visibleColumnStartIndex,
              visibleRowStopIndex,
              visibleColumnStopIndex,
            }: GridOnItemsRenderedProps) => {
              const overscanStartIndex =
                overscanRowStartIndex * cols + overscanColumnStartIndex;
              const overscanStopIndex =
                overscanRowStopIndex * cols + overscanColumnStopIndex;
              const visibleStartIndex =
                visibleRowStartIndex * cols + visibleColumnStartIndex;
              const visibleStopIndex =
                visibleRowStopIndex * cols + visibleColumnStopIndex;
              return onItemsRendered({
                overscanStartIndex: overscanStartIndex,
                overscanStopIndex: overscanStopIndex,
                visibleStartIndex: visibleStartIndex,
                visibleStopIndex: visibleStopIndex,
              });
            }}
            ref={ref}
          >
            {(params: {
              columnIndex: number;
              rowIndex: number;
              style: CSSProperties;
            }) => {
              const index = getIndex(params);
              const item = items[index];

              const isSelected = index === selected;

              return (
                <Item
                  {...item}
                  isLoading={!isItemLoaded(index)}
                  style={
                    isSelected
                      ? {
                          ...params.style,
                          boxShadow: "0px 0px 20px 10px black",
                          zIndex: 99,
                          border: "1px solid #00c8b4",
                        }
                      : params.style
                  }
                />
              );
            }}
          </FixedSizeGrid>
        )}
      </InfiniteLoader>
    </div>
  );
};

// List.whyDidYouRender = {
//   logOnDifferentValues: true,
// };
