import { EventData } from "@/app/types";
import { useEffect, useState } from "react";

export const ITEM_WIDTH_PX = 100;
export const ITEM_CONTAINER_SPACING_PX = 10;

export default function useItemSizing(event: EventData | null) {
  const [nbrVisibleSlots, setNbrVisibleSlots] = useState<number>(0);
  const [nbrDays, setNbrDays] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const containerWidth = windowWidth - ITEM_CONTAINER_SPACING_PX * 2;
      const itemWidth = ITEM_WIDTH_PX + ITEM_CONTAINER_SPACING_PX * 2;

      setNbrVisibleSlots(Math.floor(containerWidth / itemWidth));
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

  return { nbrDays, nbrVisibleSlots };
}
