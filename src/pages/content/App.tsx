import { useCallback, useEffect, useRef, useState } from "react";
import HighlighterSvg from "../../assets/svgs/HighlighterSvg";
import HighlighterPallet from "./highlighter-pallet";
import { ButtonPosition, RangeParams } from "./types";
import { highlightRange } from "./utils";

export default function App() {
  const [selectedItem, setSelectedItem] = useState<RangeParams>();
  const [buttonPosition, setButtonPosition] = useState<ButtonPosition | null>(
    null
  );
  const [showHighlighterPallet, setShowHighlighterPallet] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  function handleRemoveButton() {
    setButtonPosition(null);
    setShowHighlighterPallet(false);
  }

  const handleTextSelection = useCallback((e: MouseEvent) => {
    if ((e.target as Node).nodeName === "FREELOG-HIGHLIGHTER-CONTAINER") {
      return;
    }

    const selection = window.getSelection();
    if (!selection || !selection.rangeCount || selection.isCollapsed) {
      handleRemoveButton();
      return;
    }

    const _buttonPosition = {
      left: e.clientX - 4,
      top: e.clientY - 40,
    };

    setButtonPosition(_buttonPosition);

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

  const handleHighlight = useCallback(
    (color: string) => {
      if (selectedItem) {
        highlightRange(selectedItem, color);
        handleRemoveButton();
        const selection = window.getSelection();
        selection?.removeAllRanges();
      }
    },
    [selectedItem]
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
    <div ref={ref} onBlur={() => console.log("blur")}>
      {buttonPosition != null && (
        <div style={{ background: "red", padding: 5 }}>
          {showHighlighterPallet && (
            <div
              style={{
                position: "fixed",
                left: buttonPosition.left,
                top: buttonPosition.top - 32,
                zIndex: 10000,
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
        </div>
      )}
    </div>
  );
}
