import {
  CSSProperties,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FixedSizeGrid, GridOnItemsRenderedProps } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

export const List = <T,>({
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
    isFavorite: boolean;
    isSelected: boolean;
    onFavorite: () => void;
    onSelect: () => void;
    style: CSSProperties;
  }>;
  loadMoreItems: (startIndex: number, stopIndex: number) => void;
}) => {
  const [selected, setSelected] = useState<number>(0);
  const [favorites, setFavorites] = useState<Map<T, true>>(new Map());
  const gridRef = useRef<FixedSizeGrid>(null);

  const isItemLoaded = (index: number) => !!items[index];
  const isItemLoading = (index: number) => !items[index] && index < count;
  const isItemFavorite = (item: T) => favorites.has(item);

  const cols = Math.floor(width / 200);
  const rows = Math.ceil(items.length / cols);
  const itemWidth = (width - 30) / cols;
  const itemHeight = itemWidth * 1.5;

  const scrollToSelected = useCallback(
    (index: number) => {
      const rowIndex = Math.floor(index / cols);
      const columnIndex = index - rowIndex * cols;
      if (gridRef.current) {
        gridRef.current.scrollToItem({
          align: "auto",
          columnIndex,
          rowIndex,
        });
      }
    },
    [cols]
  );

  const selectIfExists = useCallback(
    (index: number) => {
      if (index >= 0 && index < count) {
        setSelected(index);
        scrollToSelected(index);
      }
    },
    [count, scrollToSelected]
  );

  const toggleFavorite = useCallback(
    (index: number) => {
      const item = items[index];
      if (favorites.get(item)) {
        favorites.delete(item);
      } else {
        favorites.set(item, true);
      }
      setFavorites(new Map(favorites));
    },
    [favorites, items]
  );

  const KEYS = useMemo(
    () => ({
      ArrowUp: () => selectIfExists(selected - cols),
      ArrowDown: () => selectIfExists(selected + cols),
      ArrowLeft: () => selectIfExists(selected - 1),
      ArrowRight: () => selectIfExists(selected + 1),
      Enter: () => toggleFavorite(selected),
    }),
    [cols, selectIfExists, selected, toggleFavorite]
  );

  const getIndex = ({
    rowIndex,
    columnIndex,
  }: {
    rowIndex: number;
    columnIndex: number;
  }) => rowIndex * cols + columnIndex;

  useEffect(() => {
    const isKeyHandled = (key: string): key is keyof typeof KEYS => key in KEYS;
    const handler = (e: KeyboardEvent) => {
      if (isKeyHandled(e.key)) {
        KEYS[e.key]();
      }
    };

    document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);
  }, [selected, items, KEYS, count, scrollToSelected]);

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

              return (
                <Item
                  data={item}
                  isLoading={isItemLoading(index)}
                  isFavorite={isItemFavorite(item)}
                  isSelected={index === selected}
                  onFavorite={() => toggleFavorite(index)}
                  onSelect={() => selectIfExists(index)}
                  style={params.style}
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
