import { useQuery } from "@tanstack/react-query";
import { HighlightData } from "../types";

export const highlightDataQueryKey = "highlightDataList";

export default function useHighlightItems() {
  return useQuery({
    queryKey: [highlightDataQueryKey],
    queryFn: async () => {
      const highlightDataList =
        localStorage.getItem("highlightDataList") ?? "[]";
      const parsedDataList = JSON.parse(highlightDataList) as HighlightData[];

      return parsedDataList;
    },
  });
}
