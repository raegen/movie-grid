import { CSSProperties, FC } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeGrid, GridOnItemsRenderedProps } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

const noop = () => {};

const ITEM_WIDTH = 200;
const ITEM_HEIGHT = 300;

export const List = <T,>({
  hasNextPage,
  isLoading,
  items,
  children: Item,
  loadNextPage,
}: {
  hasNextPage: boolean;
  isLoading: boolean;
  items: T[];
  children: FC<T & { style: CSSProperties; isLoading: boolean }>;
  loadNextPage: () => void;
}) => {
  const itemCount = hasNextPage ? items.length + 1 : items.length;

  const loadMoreItems = isLoading ? noop : loadNextPage;

  const isItemLoaded = (index: number) => !!items[index];
  const isItemLoading = (index: number) => (hasNextPage && index >= items.length);

  return (
    <AutoSizer>
      {({ width, height }) => {
        const cols = Math.floor(width / 200);
        const rows = Math.ceil(itemCount / cols);

        return (
          <div
            style={{ display: "flex", width, height, justifyContent: "center" }}
          >
            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={itemCount}
              loadMoreItems={loadMoreItems}
            >
              {({ onItemsRendered, ref }) => (
                <FixedSizeGrid
                  columnCount={cols}
                  columnWidth={ITEM_WIDTH}
                  overscanColumnCount={5}
                  height={height}
                  rowCount={rows}
                  rowHeight={ITEM_HEIGHT}
                  overscanRowCount={5}
                  width={cols * 200}
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
                  {({
                    columnIndex,
                    rowIndex,
                    style,
                  }: {
                    columnIndex: number;
                    rowIndex: number;
                    style: CSSProperties;
                  }) => {
                    const index = rowIndex * cols + columnIndex;
                    const item = items[index];

                    if (!isItemLoaded(index) && !isItemLoading(index)) {
                        return null;
                    }

                    return <Item
                        {...item}
                        isLoading={!isItemLoaded(index)}
                        style={style}
                    />
                  }}
                </FixedSizeGrid>
              )}
            </InfiniteLoader>
          </div>
        );
      }}
    </AutoSizer>
  );
};
