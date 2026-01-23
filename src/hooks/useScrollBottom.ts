import { useState, useLayoutEffect, useCallback } from "react";

export function useScrollBottom(
  containerRef: React.RefObject<HTMLElement | null>,
) {
  const [scrollBottom, setScrollBottom] = useState(0);

  const calculate = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setScrollBottom(el.scrollHeight - el.scrollTop - el.clientHeight);
  }, [containerRef]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    calculate();

    el.addEventListener("scroll", calculate);

    const mo = new MutationObserver(calculate);
    mo.observe(el, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      el.removeEventListener("scroll", calculate);
      mo.disconnect();
    };
  }, [calculate]);

  return scrollBottom;
}
