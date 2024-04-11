import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HighlightData } from "../types";
import { highlightDataQueryKey } from "./useHighlightItems";

export default function useDeleteHighlightItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: HighlightData) => {
      const highlightDataList =
        localStorage.getItem("highlightDataList") ?? "[]";
      const parsedDataList = JSON.parse(highlightDataList) as HighlightData[];

      const updatedDataList = parsedDataList.filter(
        (data) => data.id !== item.id
      );

      localStorage.setItem(
        "highlightDataList",
        JSON.stringify(updatedDataList)
      );

      queryClient.setQueryData(
        [highlightDataQueryKey],
        (oldDatas: HighlightData[] | undefined) => {
          if (oldDatas == null) {
            return [];
          }

          return oldDatas.filter((data) => data.id !== item.id);
        }
      );
    },
  });
}
