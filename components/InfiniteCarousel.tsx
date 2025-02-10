"use client";

import { Stack } from "@mui/material";
import StyledImage from "./StyledImage";
import { useCallback, useEffect, useRef, useState } from "react";

const NBR_OF_IMAGES = 30;

export default function InfiniteCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [imageSizes, setImageSizes] = useState<
    { width: number; height: number }[]
  >([]);

  const imageMover = useCallback(() => {
    if (!ref.current) {
      return;
    }

    const scrollRight =
      ref.current.scrollWidth -
      ref.current.clientWidth -
      ref.current.scrollLeft;
    if (scrollRight <= 700) {
      const firstImage = ref.current.children[index];
      ref.current.appendChild(firstImage.cloneNode(true));
      setIndex((prevIndex) => prevIndex + 1);
      firstImage?.firstChild?.remove();
    }
  }, [index]);

  const autoScroll = useCallback(() => {
    if (!ref.current) {
      return;
    }

    ref.current.scrollLeft += 1;
  }, []);

  useEffect(() => {
    const imageMoverInterval = setInterval(imageMover, 1000);
    const autoScrollInterval = setInterval(autoScroll, 20);

    return () => {
      clearInterval(imageMoverInterval);
      clearInterval(autoScrollInterval);
    };
  }, [imageMover, autoScroll]);

  useEffect(() => {
    const sizes = Array.from({ length: NBR_OF_IMAGES }).map(() => ({
      width: Math.floor(Math.random() * 150) + 100,
      height: Math.floor(Math.random() * 150) + 100,
    }));
    setImageSizes(sizes);
  }, []);

  return (
    <Stack
      ref={ref}
      width={"100%"}
      direction={"row"}
      alignItems={"flex-end"}
      overflow={"scroll"}
      style={{
        pointerEvents: "none",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {imageSizes.map((size, index) => (
        <StyledImage
          key={index}
          url={`/images/slider_${index + 1}.jpg`}
          width={size.width}
          height={size.height}
          alt={`Festive people ${String(index)}`}
        />
      ))}
    </Stack>
  );
}
