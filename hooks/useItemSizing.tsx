import { EventData } from "@/app/types";
import { useEffect, useState } from "react";

export const ITEM_MIN_WIDTH_PX = 110;
export const ITEM_MAX_WIDTH_PX = 200;
export const ITEM_CONTAINER_SPACING_PX = 10;

export default function useItemSizing(event: EventData | null) {
  const [nbrVisibleSlots, setNbrVisibleSlots] = useState<number>(0);
  const [nbrDays, setNbrDays] = useState<number>(0);
  const [itemWidth, setItemWidth] = useState<number>(ITEM_MIN_WIDTH_PX);

  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById("slot-container");

      if (!container) {
        return;
      }

      const containerWidth = container.clientWidth;
      const newNbrVisibleSlots = Math.floor(
        (containerWidth + ITEM_CONTAINER_SPACING_PX) /
          (ITEM_MIN_WIDTH_PX + ITEM_CONTAINER_SPACING_PX)
      );
      setNbrVisibleSlots(newNbrVisibleSlots);
      const newWidth = Math.min(
        ITEM_MAX_WIDTH_PX,
        (containerWidth -
          (newNbrVisibleSlots - 1) * ITEM_CONTAINER_SPACING_PX) /
          newNbrVisibleSlots
      );
      setItemWidth(newWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!event) {
      return setNbrDays(0);
    }

    const diff = event.dateEnd.getTime() - event.dateStart.getTime();
    const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
    setNbrDays(diffDays);
  }, [event]);

  return { nbrDays, nbrVisibleSlots, itemWidth };
}
