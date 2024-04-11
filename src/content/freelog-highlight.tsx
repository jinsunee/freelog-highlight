class FreelogHighlight extends HTMLElement {
  constructor() {
    super();

    this.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const tagName = target?.tagName;
      const highlightId = target?.dataset.freeloghighlightId;
      if (tagName === "FREELOG-HIGHLIGHT" && highlightId != null) {
        window.showModalFromHighlight({
          position: { x: e.clientX, y: e.clientY },
          id: Number(highlightId),
        });
      }
    });

    this.addEventListener("mousemove", () => {
      this.style.opacity = "0.5";
    });
    this.addEventListener("mouseleave", () => {
      this.style.opacity = "1";
    });
  }
}

customElements.define("freelog-highlight", FreelogHighlight);
