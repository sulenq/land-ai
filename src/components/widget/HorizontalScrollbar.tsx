import { Box, BoxProps } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

interface HorizontalScrollbarProps extends BoxProps {
  containerRef: React.RefObject<HTMLElement | null>;
  height?: string;
  thumbColor?: string;
  trackColor?: string;
  borderRadius?: string;
}

export function HorizontalScrollbar({
  containerRef,
  height = "6px",
  thumbColor = "fg.subtle",
  trackColor = "d2",
  borderRadius = "999px",
  ...restProps
}: HorizontalScrollbarProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [thumbWidth, setThumbWidth] = useState(0);
  const [thumbLeft, setThumbLeft] = useState(0);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const updateThumbFromScroll = () => {
      const { scrollWidth, clientWidth, scrollLeft } = container;
      const trackWidth = track.clientWidth;

      if (scrollWidth <= clientWidth) {
        setThumbWidth(0);
        setThumbLeft(0);
        return;
      }

      const width = (clientWidth / scrollWidth) * trackWidth;
      const maxLeft = trackWidth - width;
      const left = (scrollLeft / (scrollWidth - clientWidth)) * maxLeft;

      setThumbWidth(width);
      setThumbLeft(left);
    };

    updateThumbFromScroll();

    container.addEventListener("scroll", updateThumbFromScroll, {
      passive: true,
    });
    window.addEventListener("resize", updateThumbFromScroll);

    return () => {
      container.removeEventListener("scroll", updateThumbFromScroll);
      window.removeEventListener("resize", updateThumbFromScroll);
    };
  }, [containerRef]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;

      const deltaX = e.clientX - startXRef.current;
      const trackWidth = track.clientWidth;

      const scrollableWidth = container.scrollWidth - container.clientWidth;

      const maxThumbLeft = trackWidth - thumbWidth;
      if (maxThumbLeft <= 0) return;

      const scrollDelta = (deltaX / maxThumbLeft) * scrollableWidth;

      container.scrollLeft = startScrollLeftRef.current + scrollDelta;
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [containerRef, thumbWidth]);

  return (
    <Box
      ref={trackRef}
      w={"full"}
      h={height}
      bg={trackColor}
      borderRadius={borderRadius}
      pos={"relative"}
      {...restProps}
    >
      <Box
        w={`${thumbWidth}px`}
        h={"full"}
        bg={thumbColor}
        borderRadius={borderRadius}
        cursor={"pointer"}
        position={"absolute"}
        left={`${thumbLeft}px`}
        onMouseDown={(e) => {
          isDraggingRef.current = true;
          startXRef.current = e.clientX;
          startScrollLeftRef.current = containerRef.current?.scrollLeft || 0;
        }}
      />
    </Box>
  );
}
