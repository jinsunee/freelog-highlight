import { useEffect, useRef } from "react";

export default function TestComponent() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener("mouseup", (e) => {
      const target = e.target as Node;
      console.log({
        isContain: ref.current?.contains(target),
        target: e,
        ref: ref.current,
      });
    });
  }, []);

  return (
    <div ref={ref} style={{ position: "fixed", top: 100, left: 100 }}>
      <button>This is a button</button>
      <div style={{ backgroundColor: "red", padding: 10 }}>
        hahah I'm fine ya.. totally .. i'm okay :
      </div>
    </div>
  );
}
