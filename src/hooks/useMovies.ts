import { title } from "process";
import { useCallback } from "react";
import { useQuery, UseQueryOptions } from "react-query";

export const SORT = {
  "ratings.imdb": (item: Movie) => item.ratings$.imdb,
  "-ratings.imdb": (item: Movie) => -item.ratings$.imdb,
  "ratings.popularity": (item: Movie) => item.ratings$.popularity,
  "-ratings.popularity": (item: Movie) => -item.ratings$.popularity,
};

export type Sort = keyof typeof SORT;

export const DEFAULT_SORT: Sort = "ratings.imdb";

export interface Rating {
  id: "imdb" | "popularity";
  rating: number;
}

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  poster_path: string;
  title: string;
  video: boolean;
  ratings: Rating[];
  ratings$: {
    [id: string]: number;
  };
}

export const POSTER_BASE = `https://image.tmdb.org/t/p`;

export const getPosterURL = (path: string, size: number = 500) =>
  `${POSTER_BASE}/w${size}${path}`;

export const queryKey = "movies";

export const useMovies = <
  TQueryFnData extends { items: Movie[]; total: number },
  TError extends unknown
>(
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
) => {
  const select = useCallback(
    ({ items, total }: TQueryFnData) =>
      ({
        items: limit < Infinity ? items.slice(0, limit) : items,
        total,
      } as TQueryFnData),
    [limit]
  );
  return useQuery<TQueryFnData, TError>(
    [queryKey, sort, search, limit],
    () => {
      return fetch("/movies.json")
        .then((r) => r.json() as Promise<Movie[]>)
        .then((items) =>
          Array.from(new Map(items.map((item) => [item.id, item])).values())
            .map(
              (item) =>
                {
                  const rgx = new RegExp(`\\b${search}\\b`, "i");
                  let searchRelevance = 1;
                  if (search) {
                    const titleMatch = item.title.match(rgx);
                    const overviewMatch = item.overview.match(rgx);
                    if (titleMatch) {
                      searchRelevance = 1 - 0.5 * ((titleMatch.index as number) / item.title.length);
                    } else if (overviewMatch) {
                        searchRelevance = 0.5 - 0.5 * ((overviewMatch.index as number) / item.overview.length);
                    } else {
                      searchRelevance = 0;
                    }
                  }
                  return {
                    ...item,
                    searchRelevance$: searchRelevance,
                    ratings$: item.ratings.reduce(
                      (acc, curr) => ({ ...acc, [curr.id]: curr.rating }),
                      {} as { [id: string]: number }
                    ),
                  } as Movie
                }
            )
            .sort((a, b) => SORT[DEFAULT_SORT](b) - SORT[DEFAULT_SORT](a))
        )
        .then((data) => {
          let items = data.slice();
          if (search) {
            const rgx = new RegExp(`\\b${search}\\b`, "i");
            items = items.filter(
              ({ title, overview }) => title.match(rgx) || overview.match(rgx)
            );
          }
          if (sort !== DEFAULT_SORT) {
            items.sort((a, b) => SORT[sort](b) - SORT[sort](a));
          }
          return {
            items: items,
            total: items.length,
          };
        }) as Promise<TQueryFnData>;
    },
    {
      ...options,
      select,
      keepPreviousData: true,
    }
  );
};
