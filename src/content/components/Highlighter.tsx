import { useCallback, useEffect, useState } from "react";
import HighlighterSvg from "../../assets/svgs/HighlighterSvg";
import useHighlightFirst from "../hooks/useHighlightFirst";
import { ButtonPosition, HighlightData, HighlightRangeData } from "../types";
import {
  findParentNodeOffsetFromRealNode,
  findRealNodeFromParentNodeOffset,
  getXPath,
  highlightRange,
} from "../utils";
import HighlighterPallet from "./highlighter-pallet";

export default function Highlighter() {
  useHighlightFirst();

  const [selectedItem, setSelectedItem] = useState<HighlightRangeData>();
  const [buttonPosition, setButtonPosition] = useState<ButtonPosition | null>(
    null
  );
  const [showHighlighterPallet, setShowHighlighterPallet] = useState(false);

  function handleRemoveButton() {
    setButtonPosition(null);
    setShowHighlighterPallet(false);
  }

  const handleTextSelection = useCallback((e: MouseEvent) => {
    if ((e.target as Node).nodeName === "FREELOG-HIGHLIGHTER-TOOLBOX-POPUP") {
      return;
    }

    const selection = window.getSelection();
    const text = selection?.toString() ?? "";

    if (!selection || !selection.rangeCount || selection.isCollapsed || !text) {
      handleRemoveButton();
      return;
    }

    const _buttonPosition = {
      left: e.clientX - 4,
      top: e.clientY - 40,
    };
    setButtonPosition(_buttonPosition);

    const range = selection.getRangeAt(0);

    const start = findParentNodeOffsetFromRealNode({
      node: range.startContainer,
      offset: range.startOffset,
    });
    const end = findParentNodeOffsetFromRealNode({
      node: range.endContainer,
      offset: range.endOffset,
    });

    if (!start || !end) {
      return;
    }

    setSelectedItem({
      start,
      end,
      text,
    });
  }, []);

  const saveOnStorage = useCallback(
    async ({ start, end }: HighlightRangeData, theme: string) => {
      const startParentPath = getXPath(start.parentNode as Node);
      const endParentPath = getXPath(end.parentNode as Node);

      if (!startParentPath || !endParentPath || selectedItem == null) {
        throw new Error("Failed to get XPath");
      }

      // localStorage에 HighlightData 형태로 저장하기
      const highlightData: HighlightData = {
        id: Date.now(),
        url: window.location.href,
        text: selectedItem.text,
        createdAt: new Date().toISOString(),
        startParentPath,
        startOffset: start.offset,
        endParentPath,
        endOffset: end.offset,
        style: { backgroundColor: theme },
      };

      const highlightDataList =
        (await localStorage.getItem("highlightDataList")) ?? "[]";
      const highlightDataListParsed = JSON.parse(
        highlightDataList
      ) as HighlightData[];
      await localStorage.setItem(
        "highlightDataList",
        JSON.stringify([...highlightDataListParsed, highlightData])
      );

      return highlightData;
    },
    [selectedItem]
  );

  const handleHighlight = useCallback(
    async (color: string) => {
      if (selectedItem && selectedItem.start && selectedItem.end) {
        const start = findRealNodeFromParentNodeOffset(selectedItem.start);
        const end = findRealNodeFromParentNodeOffset(selectedItem.end);

        if (!start || !end) {
          return;
        }

        const result = await saveOnStorage(selectedItem, color);

        highlightRange({ start, end }, { theme: color, id: result.id });

        handleRemoveButton();
        const selection = window.getSelection();
        selection?.removeAllRanges();
      }
    },
    [selectedItem, saveOnStorage]
  );

  useEffect(() => {
    document.addEventListener("mouseup", handleTextSelection);
    document.addEventListener("scroll", handleRemoveButton);

    return () => {
      document.removeEventListener("mouseup", handleTextSelection);
      document.removeEventListener("scroll", handleRemoveButton);
    };
  }, [handleTextSelection, buttonPosition]);

  return (
    <>
      {buttonPosition != null && (
        <>
          {showHighlighterPallet && (
            <div
              style={{
                position: "fixed",
                left: buttonPosition.left,
                top: buttonPosition.top - 50,
                zIndex: 10001,
              }}
            >
              <HighlighterPallet onSelectColor={handleHighlight} />
            </div>
          )}
          <button
            style={{
              position: "fixed",
              left: buttonPosition.left,
              top: buttonPosition.top,
              zIndex: 10000,
              backgroundColor: "#101010",
              border: "1px solid #bdbaba",
              borderRadius: "5px",
              width: 34,
              height: 34,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onMouseMove={() => setShowHighlighterPallet(true)}
          >
            <HighlighterSvg />
          </button>
        </>
      )}
    </>
  );
}
