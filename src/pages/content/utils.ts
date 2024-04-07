import {
  HighlightParams,
  HighlightRangeItemData,
  RealNodeRangeData,
} from "./types";

// 내가 생각하는 부분이 문제가 안될 것 같아.
// Why?
// 우선 왜 이런 구조로 했는지부터 생각해보자. 어떤 문제가 있어서 이렇게 구조를 짠거지?
// 왜냐면 <freelog-webhighlight></freelog-webhighlight> 태그로 감싸지면 해당 태그의 위치가 바뀌게 되기 때문이야.
// 따라서 부모노드의 자식들을 텍스트로 취급하고 그 offset을 구하는 것으로 저장을 해둔 뒤, 사용할 때는 실제 offset을 찾아서 node와 offset을 구해줘야해.

// 이 함수는 언제 사용되는거지?
// -> 선택되고 나서 바로 변환이 되고, 이후에 state에서 사용되거나 DB에 저장될 때 사용되는 형식이야.
export function findParentNodeOffsetFromRealNode({
  node, // 무조건 TextNode임.
  offset,
}: {
  node: Node;
  offset: number;
}) {
  const parentNode = node.parentNode;
  if (parentNode == null) {
    return null;
  }

  // offset을 찾기 위한 과정임.
  // parentNode 안에 있는 모든 text node를 순회하면서 offset을 찾아야함.
  const range = document.createRange();
  range.selectNodeContents(parentNode);

  // Tree순회를 위해서 TreeWalker를 사용함. 따라서 TextNode만 필터링 해서 가져오며 반복문을 통해서 꺼내볼 수 있음.
  // 자식 뿐만 아니라 자식의 자식까지 재귀적으로 순회할 수 있음.
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
  // DFS로 순회된다.
  while ((_node = walker.nextNode())) {
    if (_node === node) {
      break;
    }
    textOffset += _node.textContent?.length ?? 0;
  }

  return { parentNode, offset: textOffset } as HighlightRangeItemData;
}

// 실제로 그릴 때 사용되는 함수.
// 실제 drawing 할 때. <freelog-highlight></freelog-highlight> 태그로 감싸서 그림을 그릴 때 사용되는 함수임.
// 왜냐면 하이라이트 관련 정보가 { parentNode, offset }으로 이루어져있기 때문에 실제로 그릴 때는 realNode와 그에 맞는 offset을 찾아서 그려야하기 때문.
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
  // 내부 text node를 순회하면서 offset이 포함된 node를 찾아야한다.
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
  theme: string
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
    range.surroundContents(highlightSpan);
  } catch (error) {
    console.error("Error applying highlight:", error);
  }
};

export const highlightRange = (
  { start, end }: RealNodeRangeData,
  theme: string
): void => {
  if (start.node === end.node) {
    drawHighlight(
      {
        node: start.node,
        startOffset: start.offset,
        endOffset: end.offset,
      },
      theme
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
        theme
      );
    } else if (node === endNode) {
      drawHighlight(
        {
          node: node,
          startOffset: 0,
          endOffset: end.offset,
        },
        theme
      );
    } else {
      drawHighlight(
        {
          node: node,
          startOffset: 0,
          endOffset: (node as Text).length,
        },
        theme
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
