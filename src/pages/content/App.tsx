import { useCallback, useEffect, useRef, useState } from "react";
import HighlighterSvg from "../../assets/svgs/HighlighterSvg";
import { RangeParams } from "./types";
import { highlightRange } from "./utils";

export default function App() {
  const [selectedItem, setSelectedItem] = useState<RangeParams>();
  const [buttonPosition, setButtonPosition] = useState<{
    left: number;
    top: number;
  } | null>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);

  function handleRemoveButton() {
    setButtonPosition(null);
  }

  const handleTextSelection = useCallback((e: MouseEvent) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount || selection.isCollapsed) {
      handleRemoveButton();
      return;
    }

    const buttonPosition = {
      left: e.clientX - 4,
      top: e.clientY - 40,
    };

    setButtonPosition(buttonPosition);

    const range = selection.getRangeAt(0);
    const startNode = range.startContainer;
    const startOffset = range.startOffset;
    const endNode = range.endContainer;
    const endOffset = range.endOffset;

    setSelectedItem({
      start: { node: startNode, offset: startOffset },
      end: { node: endNode, offset: endOffset },
    });
  }, []);

  const handleHighlight = useCallback(() => {
    if (selectedItem) {
      highlightRange(selectedItem);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      handleRemoveButton();
    }
  }, [selectedItem]);

  useEffect(() => {
    document.addEventListener("mouseup", handleTextSelection);
    document.addEventListener("scroll", handleRemoveButton);

    return () => {
      document.removeEventListener("mouseup", handleTextSelection);
      document.removeEventListener("scroll", handleRemoveButton);
    };
  }, [handleTextSelection]);

  return (
    <>
      {buttonPosition != null && (
        <button
          ref={buttonRef}
          style={{
            position: "fixed",
            left: buttonPosition.left,
            top: buttonPosition.top,
            zIndex: 10000,
            backgroundColor: "#101010",
            border: "1px solid #bdbaba",
            borderRadius: "5px",
            padding: "5px",
          }}
          onClick={handleHighlight}
        >
          <HighlighterSvg />
        </button>
      )}
    </>
  );
}
