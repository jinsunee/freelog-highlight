import { useMutation } from "@tanstack/react-query";
import { HighlightData } from "../types";

export default function useUpdateHighlightTheme() {
  return useMutation({
    mutationFn: async ({
      item,
      newTheme,
    }: {
      item: HighlightData;
      newTheme: string;
    }) => {
      const highlightDataList =
        localStorage.getItem("highlightDataList") ?? "[]";
      const parsedDataList = JSON.parse(highlightDataList) as HighlightData[];

      const updatedDataList = parsedDataList.map((data) => {
        if (data.id === item.id) {
          return {
            ...data,
            style: { ...data.style, backgroundColor: newTheme },
          };
        }

        return data;
      });

      localStorage.setItem(
        "highlightDataList",
        JSON.stringify(updatedDataList)
      );
    },
  });
}
