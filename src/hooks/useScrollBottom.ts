import { useState, useEffect } from "react";

export function useScrollBottom(
  containerRef: React.RefObject<HTMLElement | null>,
  dependencies: any[] = [],
) {
  const [scrollBottom, setScrollBottom] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollHeight, scrollTop, clientHeight } = container;
      setScrollBottom(scrollHeight - scrollTop - clientHeight);
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll(); // initial update

    return () => container.removeEventListener("scroll", handleScroll);
  }, [containerRef, ...dependencies]);

  return scrollBottom;
}
