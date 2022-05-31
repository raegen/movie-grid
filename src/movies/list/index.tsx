import {
  CSSProperties,
  FC,
  useRef,
} from "react";
import { FixedSizeGrid, GridOnItemsRenderedProps } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { Adjacent } from "../../types";

export const List = <T extends { id: number }>({
  items,
  count,
  children: Item,
  loadMoreItems,
  width,
  height,
}: {
  items: T[];
  count: number;
  height: number;
  width: number;
  children: FC<{
    data: T;
    isLoading: boolean;
    style: CSSProperties;
    adjacent: Adjacent;
  }>;
  loadMoreItems: (startIndex: number, stopIndex: number) => void;
}) => {
  const gridRef = useRef<FixedSizeGrid>(null);

  const isItemLoaded = (index: number) => !!items[index];
  const isItemLoading = (index: number) => !items[index] && index < count;

  const cols = Math.floor(width / 200);
  const rows = Math.ceil(items.length / cols);
  const itemWidth = width / cols;
  const itemHeight = itemWidth * 1.5;

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
        itemCount={count}
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered, ref }) => (
          <FixedSizeGrid
            columnCount={cols}
            columnWidth={itemWidth}
            height={height}
            rowCount={rows}
            rowHeight={itemHeight}
            itemKey={({ columnIndex, rowIndex, data }) =>
              data?.id || getIndex({ columnIndex, rowIndex })
            }
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
            ref={gridRef}
            className="grid"
          >
            {(params: {
              columnIndex: number;
              rowIndex: number;
              style: CSSProperties;
            }) => {
              const index = getIndex(params);
              const item = items[index];
              const isLoading = isItemLoading(index);

              // count%cols !== 0
              if (!item && !isLoading) {
                return null;
              }

              return (
                <Item
                  data={item}
                  isLoading={isLoading}
                  style={params.style}
                  adjacent={{
                    up: items[index - cols]?.id,
                    right: items[index + 1]?.id,
                    down: items[index + cols]?.id,
                    left: items[index - 1]?.id
                  }}
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
