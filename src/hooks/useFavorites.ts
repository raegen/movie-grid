import { useMutation, useQuery } from "react-query";
import { queryClient } from ".";

export const useFavorites = () =>
  useQuery(["favorites"], () =>
    Promise.resolve(queryClient.getQueryData(["favorites"]))
  );

export const useIsFavorite = (id: number) =>
  useQuery(["favorites", id], () =>
    Promise.resolve(queryClient.getQueryData(["favorites", id]))
  );

export const useSetFavorite = (id: number) =>
  useMutation((favorite: boolean) => {
    return new Promise((resolve) => {
      queryClient.setQueryData(["favorites", id], favorite);
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  });
