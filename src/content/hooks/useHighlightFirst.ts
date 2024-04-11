import { useEffect } from "react";
import { findRealNodeFromParentNodeOffset, highlightRange } from "../utils";
import useHighlightItems from "./useHighlightItems";

export default function useHighlightFirst() {
  const { data } = useHighlightItems();

  useEffect(() => {
    if (!data) {
      return;
    }

    setTimeout(() => {
      if (data) {
        for (const {
          id,
          startParentPath,
          endParentPath,
          style,
          startOffset,
          endOffset,
        } of data) {
          const startParentNode = document.evaluate(
            startParentPath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue as Node;

          const endParentNode = document.evaluate(
            endParentPath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue as Node;

          if (startParentNode == null || endParentNode == null) {
            return;
          }

          const start = findRealNodeFromParentNodeOffset({
            parentNode: startParentNode,
            offset: startOffset,
          });

          const end = findRealNodeFromParentNodeOffset({
            parentNode: endParentNode,
            offset: endOffset,
          });

          if (!start || !end) {
            return;
          }

          highlightRange(
            {
              start,
              end,
            },
            {
              theme: style.backgroundColor!,
              id,
            }
          );
        }
      }
    }, 500);
  }, [data]);
}
