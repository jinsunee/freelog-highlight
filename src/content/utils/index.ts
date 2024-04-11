import {
  HighlightParams,
  HighlightRangeItemData,
  RealNodeRangeData,
} from "../types";

export function findParentNodeOffsetFromRealNode({
  node,
  offset,
}: {
  node: Node;
  offset: number;
}) {
  const parentNode = node.parentNode;
  if (parentNode == null) {
    return null;
  }

  const range = document.createRange();
  range.selectNodeContents(parentNode);

  const walker = document.createTreeWalker(
    range.commonAncestorContainer,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function (node) {
        if (!range.intersectsNode(node)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  let _node,
    textOffset = offset;

  while ((_node = walker.nextNode())) {
    if (_node === node) {
      break;
    }
    textOffset += _node.textContent?.length ?? 0;
  }

  return { parentNode, offset: textOffset } as HighlightRangeItemData;
}

export function findRealNodeFromParentNodeOffset({
  parentNode,
  offset,
}: {
  parentNode: Node;
  offset: number;
}) {
  const range = document.createRange();
  range.selectNodeContents(parentNode);

  const walker = document.createTreeWalker(
    range.commonAncestorContainer,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function (node) {
        if (!range.intersectsNode(node)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  let node,
    tmpOffset = 0;
  while ((node = walker.nextNode())) {
    const textLength = node.textContent?.length ?? 0;
    if (tmpOffset + textLength >= offset) {
      return { node, offset: offset - tmpOffset };
    }
    tmpOffset += textLength;
  }

  return null;
}

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
  if (el.nodeType === Node.TEXT_NODE) {
    return createXPathFromElement(el.parentNode as Element);
  } else {
    return createXPathFromElement(el as Element);
  }
}

export const drawHighlight = (
  { node, startOffset, endOffset }: HighlightParams,
  { theme, id }: { theme: string; id: number }
): void => {
  if (!node || startOffset == null || endOffset == null || !node.textContent) {
    return;
  }

  try {
    const range = new Range();
    range.setStart(node, startOffset);
    range.setEnd(node, endOffset);

    const highlightSpan = document.createElement("freelog-highlight");
    highlightSpan.style.backgroundColor = theme;
    highlightSpan.dataset.freeloghighlightId = id.toString();
    range.surroundContents(highlightSpan);
  } catch (error) {
    console.error("Error applying highlight:", error);
  }
};

export const highlightRange = (
  { start, end }: RealNodeRangeData,
  { theme, id }: { theme: string; id: number }
): void => {
  if (start.node === end.node) {
    drawHighlight(
      {
        node: start.node,
        startOffset: start.offset,
        endOffset: end.offset,
      },
      { theme, id }
    );
    return;
  }

  const { resultNodes, startNode, endNode } = findTextNodes({ start, end });

  resultNodes.forEach((node) => {
    if (node.nodeName === "FREELOG-HIGHLIGHT") {
      return;
    }

    if (node === startNode) {
      drawHighlight(
        {
          node: node,
          startOffset: start.offset,
          endOffset: (node as Text).length,
        },
        { theme, id }
      );
    } else if (node === endNode) {
      drawHighlight(
        {
          node: node,
          startOffset: 0,
          endOffset: end.offset,
        },
        { theme, id }
      );
    } else {
      drawHighlight(
        {
          node: node,
          startOffset: 0,
          endOffset: (node as Text).length,
        },
        { theme, id }
      );
    }
  });
};

function findTextNodes({ start, end }: RealNodeRangeData) {
  const range = document.createRange();
  const resultNodes = [];

  const startNode = start.node;
  const endNode = end.node;

  range.setStart(startNode, start.offset);
  range.setEnd(endNode, end.offset);

  const walker = document.createTreeWalker(
    range.commonAncestorContainer,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: function (node) {
        if (
          node.parentElement &&
          node.parentElement.nodeName === "FREELOG-HIGHLIGHT"
        ) {
          return NodeFilter.FILTER_REJECT;
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
    if (currentNode.nodeName === "FREELOG-HIGHLIGHT") {
      resultNodes.push(currentNode);
    } else if (currentNode.nodeType === Node.TEXT_NODE) {
      resultNodes.push(currentNode);
    }
    currentNode = walker.nextNode();
  }

  return { resultNodes: resultNodes, startNode, endNode };
}
