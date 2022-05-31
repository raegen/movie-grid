import { UseQueryResult } from "react-query";

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
  release_date: string;
  ratings$: {
    [id: string]: number;
  };
  searchRelevance$: number;
}

// Since we're providing placeholder data for useMovies, data is never undefined
// so using this will avoid unnecessary ? checks
export type SafeUseQueryResult<
  TQueryFnData,
  TError,
  TQueryResult extends UseQueryResult<TQueryFnData, TError> = UseQueryResult<
    TQueryFnData,
    TError
  >
> = TQueryResult & { data: NonNullable<TQueryResult["data"]> };

export interface Adjacent {
  up?: number;
  right?: number;
  down?: number;
  left?: number;
}
