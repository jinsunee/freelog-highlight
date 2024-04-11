class FreelogHighlight extends HTMLElement {
  constructor() {
    super();

    this.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const tagName = target?.tagName;
      const highlightId = target?.dataset.freeloghighlightId;
      if (tagName === "FREELOG-HIGHLIGHT" && highlightId != null) {
        window.showModalFromHighlight(
          {
            position: { x: e.clientX, y: e.clientY },
            id: Number(highlightId),
          },
          target
        );
      }
    });

    document.addEventListener("mousemove", (e) => {
      const target = e.target as HTMLElement;
      if (target?.tagName !== "FREELOG-HIGHLIGHT") {
        return;
      }

      const id = Number(target.dataset.freeloghighlightId ?? "-1");
      if (id > 0) {
        const elements = document.querySelectorAll(
          `[data-freeloghighlight-id="${id}"]`
        );

        elements.forEach((el) => {
          (el as HTMLElement).style.opacity = "0.7";
        });
      }
    });
    document.addEventListener("mouseout", (e) => {
      const target = e.target as HTMLElement;
      if (target?.tagName !== "FREELOG-HIGHLIGHT") {
        return;
      }

      const id = Number(target.dataset.freeloghighlightId ?? "-1");
      if (id > 0) {
        const elements = document.querySelectorAll(
          `[data-freeloghighlight-id="${id}"]`
        );

        elements.forEach((el) => {
          (el as HTMLElement).style.opacity = "1";
        });
      }
    });
  }
}

customElements.define("freelog-highlight", FreelogHighlight);
