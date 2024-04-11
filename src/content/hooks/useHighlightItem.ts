import { useEffect, useState } from "react";
import { HighlightData } from "../types";
import useHighlightItems from "./useHighlightItems";

export default function useHighlightItem(id?: HighlightData["id"]) {
  const { data } = useHighlightItems();
  const [item, setItem] = useState<HighlightData>();

  useEffect(() => {
    if (!data || id == null) {
      return;
    }

    const _item = data?.find((item) => item.id === id);
    setItem(_item);
  }, [data, id]);

  return item;
}
