import { useCallback, useRef } from "react";
import { useQuery, UseQueryOptions } from "react-query";
import { Movie, SafeUseQueryResult } from "../types";

export const SORT = {
  "ratings.imdb": (item: Movie) => item.ratings$.imdb,
  "-ratings.imdb": (item: Movie) => -item.ratings$.imdb,
  "ratings.popularity": (item: Movie) => item.ratings$.popularity,
  "-ratings.popularity": (item: Movie) => -item.ratings$.popularity,
};
export type Sort = keyof typeof SORT;
export const DEFAULT_SORT: Sort = "ratings.imdb";

export const POSTER_BASE = `https://image.tmdb.org/t/p`;

export const getPosterURL = (path: string, size: number = 500) =>
  `${POSTER_BASE}/w${size}${path}`;

interface TData {
  items: Movie[];
  total: number;
}

const PLACEHOLDER_DATA: TData = {
  items: [] as Movie[],
  total: 0,
};

export const queryKey = "movies";

export const useMovies = <TQueryFnData extends TData, TError extends unknown>(
  {
    limit = Infinity,
    sort = DEFAULT_SORT,
    search,
  }: {
    limit?: number;
    sort?: Sort;
    search?: string;
  } = {},
  options: UseQueryOptions<TQueryFnData, TError> = {}
): SafeUseQueryResult<TQueryFnData, TError> => {
  const select = useCallback(
    ({ items, total }: TQueryFnData) =>
      ({
        items: limit < Infinity ? items.slice(0, limit) : items,
        total,
      } as TQueryFnData),
    [limit]
  );
  const searchRef = useRef<string>();
  return useQuery<TQueryFnData, TError>(
    [queryKey, sort, search, limit],
    () => {
      searchRef.current = search;
      return fetch("/movies.json")
        .then((r) => r.json() as Promise<Movie[]>)
        .then((items) =>
          Array.from(new Map(items.map((item) => [item.id, item])).values())
            .reduce((acc, item) => {
              const rgx = new RegExp(`\\b${search}\\b`, "i");
              let searchRelevance = 1;
              if (search) {
                const titleMatch = item.title.match(rgx);
                const overviewMatch = item.overview.match(rgx);
                if (titleMatch) {
                  searchRelevance =
                    1 -
                    0.5 *
                      ((titleMatch.index as number) /
                        (item.title.length - search.length));
                } else if (overviewMatch) {
                  searchRelevance =
                    0.5 -
                    0.5 *
                      ((overviewMatch.index as number) /
                        (item.overview.length - search.length));
                } else {
                  searchRelevance = 0;
                }

                if (!searchRelevance) {
                  return acc;
                }
              }

              return [
                ...acc,
                {
                  ...item,
                  searchRelevance$: searchRelevance,
                  ratings$: item.ratings.reduce(
                    (acc, curr) => ({ ...acc, [curr.id]: curr.rating }),
                    {} as { [id: string]: number }
                  ),
                } as Movie,
              ];
            }, [] as Movie[])
            .sort(
              (a, b) =>
                b.searchRelevance$ - a.searchRelevance$ ||
                SORT[sort](b) - SORT[sort](a)
            )
        )
        .then(
          (items) =>
            ({
              items: items,
              total: items.length,
            } as TQueryFnData)
        );
    },
    {
      ...options,
      select,
      keepPreviousData: search === searchRef.current,
      placeholderData: PLACEHOLDER_DATA as TQueryFnData,
    }
  ) as SafeUseQueryResult<TQueryFnData, TError>;
};
