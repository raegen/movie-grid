import { useMutation, useQuery } from "react-query";
import { queryClient } from ".";

export const useSelected = () =>
  useQuery(["selected"], () =>
    Promise.resolve(queryClient.getQueryData(["selected"]))
  );

export const useIsSelected = (id: number) => {
  const { data: selected } = useSelected();
  return selected === id;
};

export const useSetSelected = () =>
  useMutation((id: number) => {
    return new Promise((resolve) => {
      queryClient.setQueryData(["selected"], id);
      setTimeout(() => {
        resolve(id);
      }, 500);
    });
  });
