import { useCallback, useEffect, useState } from "react";
import TrashSvg from "../../assets/svgs/TrashSvg";
import HighlighterPallet from "../components/highlighter-pallet";
import useDeleteHighlightItem from "../hooks/useDeleteHighlightItem";
import useHighlightItem from "../hooks/useHighlightItem";
import useUpdateHighlightTheme from "../hooks/useUpdateHighlightTheme";
import { HighlightData, Position } from "../types";

const LINE_HEIGHT = 50;

function useSelectedHighlightItem() {
  const [position, setPosition] = useState<Position | null>(null);
  const [id, setId] = useState<HighlightData["id"] | null>(null);
  const [selectedNode, setSelectedNode] = useState<HTMLElement | null>();
  const item = useHighlightItem(id);

  function handleClearItem() {
    setPosition(null);
    setId(null);
  }

  useEffect(() => {
    window.showModalFromHighlight = (item, target) => {
      setPosition(item.position);
      setId(item.id);
      setSelectedNode(target);
    };
  }, []);

  return { item, position, selectedNode, onClearItem: handleClearItem };
}

export default function HighlightMenu() {
  const { item, position, selectedNode, onClearItem } =
    useSelectedHighlightItem();
  const { mutateAsync: onUpdateHighlightTheme } = useUpdateHighlightTheme();
  const { mutateAsync: onDeleteHightlightItem } = useDeleteHighlightItem();

  const [showHighlighterPallet, setShowHighlighterPallet] = useState(false);

  const handleRemoveButton = useCallback(() => {
    onClearItem();
    setShowHighlighterPallet(false);
  }, [onClearItem]);

  const handleSelectColor = useCallback(
    async (theme: string) => {
      if (!selectedNode || item == null) {
        return;
      }

      await onUpdateHighlightTheme({ item, newTheme: theme });
      const elements = document.querySelectorAll(
        `[data-freeloghighlight-id="${item.id}"]`
      );

      elements.forEach((el) => {
        (el as HTMLElement).style.backgroundColor = theme;
      });
      setShowHighlighterPallet(false);
    },
    [item, selectedNode, onUpdateHighlightTheme]
  );

  const handleDeleteHighlightItem = useCallback(async () => {
    if (item == null || !selectedNode) {
      return;
    }

    await onDeleteHightlightItem(item);
    const textNode = document.createTextNode(selectedNode.textContent ?? "");
    selectedNode.replaceWith(textNode);
    handleRemoveButton();
  }, [handleRemoveButton, item, onDeleteHightlightItem, selectedNode]);

  useEffect(() => {
    function handleMouseUp(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (
        !(
          target?.tagName === "FREELOG-HIGHLIGHTER-TOOLBOX-POPUP" ||
          target?.tagName === "FREELOG-HIGHLIGHT"
        )
      ) {
        handleRemoveButton();
      }
    }

    document.addEventListener("click", handleMouseUp);
    document.addEventListener("scroll", handleRemoveButton);

    return () => {
      document.removeEventListener("click", handleMouseUp);
      document.removeEventListener("scroll", handleRemoveButton);
    };
  }, [handleRemoveButton, item]);

  return (
    <>
      {item != null && position != null && (
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
              <div
                style={{
                  background: "none",
                  border: "none",
                  width: 20,
                  height: 20,
                  borderRadius: 5,
                  backgroundColor: item.style.backgroundColor,
                }}
                onClick={() => setShowHighlighterPallet(true)}
              />
              <button
                style={{ background: "none", border: "none", padding: 4 }}
                onClick={handleDeleteHighlightItem}
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
                top: position.y - LINE_HEIGHT - 34,
              }}
            >
              <HighlighterPallet onSelectColor={handleSelectColor} />
            </div>
          )}
        </>
      )}
    </>
  );
}
