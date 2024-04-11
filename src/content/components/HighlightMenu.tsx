import { useCallback, useEffect, useState } from "react";
import TrashSvg from "../../assets/svgs/TrashSvg";
import HighlighterPallet from "../components/highlighter-pallet";
import useHighlightItem from "../hooks/useHighlightItem";
import { HighlightData, Position } from "../types";

const LINE_HEIGHT = 50;

export default function HighlightMenu() {
  const [showHighlighterPallet, setShowHighlighterPallet] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [id, setId] = useState<HighlightData["id"]>();
  const item = useHighlightItem(id);

  const handleRemoveButton = useCallback(() => {
    setPosition(null);
    setShowHighlighterPallet(false);
  }, []);

  useEffect(() => {
    window.showModalFromHighlight = ({ position, id }) => {
      setPosition(position);
      setId(id);
    };
  }, []);

  useEffect(() => {
    function handleMouseUp(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target == null || target?.tagName !== "FREELOG-HIGHLIGHT") {
        handleRemoveButton();
      }
    }

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("scroll", handleRemoveButton);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("scroll", handleRemoveButton);
    };
  }, [handleRemoveButton]);

  useEffect(() => {
    console.log({ item });
  }, [item]);

  return (
    <>
      {position != null && (
        <>
          <div
            style={{
              position: "fixed",
              left: position.x,
              top: position.y - LINE_HEIGHT,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                backgroundColor: "#444444",
                padding: 4,
                borderRadius: 5,
              }}
            >
              <button
                style={{ background: "none", border: "none", padding: 4 }}
              >
                <TrashSvg />
              </button>
            </div>
          </div>
          {showHighlighterPallet && (
            <div
              style={{
                position: "fixed",
                left: position.x,
                top: position.y - LINE_HEIGHT - 50,
              }}
            >
              <HighlighterPallet onSelectColor={() => {}} />
            </div>
          )}
        </>
      )}
    </>
  );
}
