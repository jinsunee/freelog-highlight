import { HighlightParams, RangeParams } from "./types";

export function createXPathFromElement(elm: Element): string | null {
  const allNodes = document.getElementsByTagName("*");
  const segs: string[] = [];

  for (
    let currentElm: Element | null = elm;
    currentElm && currentElm.nodeType === 1;
    currentElm = currentElm.parentNode as Element | null
  ) {
    if (currentElm.hasAttribute("id")) {
      let uniqueIdCount = 0;
      for (const node of allNodes) {
        if (node.hasAttribute("id") && node.id === currentElm.id)
          uniqueIdCount++;
        if (uniqueIdCount > 1) break;
      }
      if (uniqueIdCount === 1) {
        segs.unshift(`//*[@id="${currentElm.getAttribute("id")}"]`);
        return segs.join("/");
      } else {
        segs.unshift(
          `${currentElm.localName.toLowerCase()}[@id="${currentElm.getAttribute(
            "id"
          )}"]`
        );
      }
    } else if (currentElm.hasAttribute("class")) {
      segs.unshift(
        `${currentElm.localName.toLowerCase()}[@class="${currentElm.getAttribute(
          "class"
        )}"]`
      );
    } else {
      let i = 1;
      let sib: Node | null;
      for (sib = currentElm.previousSibling; sib; sib = sib.previousSibling) {
        if (sib.nodeType === 1 && sib.nodeName === currentElm.nodeName) i++;
      }
      segs.unshift(`${currentElm.localName.toLowerCase()}[${i}]`);
    }
  }

  return segs.length ? `/${segs.join("/")}` : null;
}

export function getXPath(el: Node): string | null {
  if (el.nodeType === 3) {
    return createXPathFromElement(el.parentNode as Element) + "/text()";
  } else {
    return createXPathFromElement(el as Element);
  }
}

export const drawHighlight = ({
  node,
  startOffset,
  endOffset,
}: HighlightParams): void => {
  if (!node || startOffset == null || endOffset == null || !node.textContent) {
    return;
  }

  try {
    const range = new Range();
    range.setStart(node, startOffset);
    range.setEnd(node, endOffset);

    const highlightSpan = document.createElement("freelog-highlight");
    highlightSpan.className = "fh-orange";
    range.surroundContents(highlightSpan);
  } catch (error) {
    console.error("Error applying highlight:", error);
  }
};

export const highlightRange = ({ start, end }: RangeParams): void => {
  if (!start || !end) {
    return;
  }

  if (start.node === end.node) {
    drawHighlight({
      node: start.node,
      startOffset: start.offset,
      endOffset: end.offset,
    });
    return;
  }

  const { resultNodes, startNode, endNode } = findTextNodes({ start, end });

  resultNodes.forEach((node) => {
    if (node.nodeName === "FREELOG-HIGHLIGHT") {
      return;
    }

    if (node === startNode) {
      drawHighlight({
        node: node,
        startOffset: start.offset,
        endOffset: (node as Text).length,
      });
    } else if (node === endNode) {
      drawHighlight({
        node: node,
        startOffset: 0,
        endOffset: end.offset,
      });
    } else {
      drawHighlight({
        node: node,
        startOffset: 0,
        endOffset: (node as Text).length,
      });
    }
  });
};

function findTextNodes({ start, end }: RangeParams) {
  const range = document.createRange();
  const resultNodes = [];

  const startNode = start.node;
  const endNode = end.node;

  range.setStart(startNode, start.offset);
  range.setEnd(endNode, end.offset);

  const walker = document.createTreeWalker(
    range.commonAncestorContainer,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, // SHOW_ELEMENT를 추가
    {
      acceptNode: function (node) {
        if (
          node.parentElement &&
          node.parentElement.nodeName === "FREELOG-HIGHLIGHT"
        ) {
          return NodeFilter.FILTER_REJECT; // <freelog-highlight>의 자식 노드는 건너뛰기
        }
        if (range.intersectsNode(node)) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_REJECT;
      },
    }
  );

  let currentNode = walker.nextNode();
  while (currentNode) {
    // <freelog-highlight> 요소 자체를 결과 배열에 추가
    if (currentNode.nodeName === "FREELOG-HIGHLIGHT") {
      resultNodes.push(currentNode);
    } else if (currentNode.nodeType === Node.TEXT_NODE) {
      resultNodes.push(currentNode);
    }
    currentNode = walker.nextNode();
  }

  return { resultNodes: resultNodes, startNode, endNode };
}
