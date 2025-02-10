"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { EventData, TimeSlot } from "@/app/types";
import useLocale from "@/hooks/useLocale";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useParams, usePathname } from "next/navigation";
import checkSlotSuperposition from "@/lib/checkSlotSuperposition";
import getEvent from "@/server/getEvent";
import saveSlots from "@/server/saveSlot";
import { removeSlot } from "@/server/removeSlot";
import useItemSizing from "@/hooks/useItemSizing";

type SlotContextType = {
  event: EventData | null;
  mode: "use" | "edit";
  loading: boolean;
  nbrVisibleSlots: number;
  nbrDays: number;
  deleteSlot: (slotId: string) => Promise<boolean>;
  updateSlot: (slots: null | TimeSlot[]) => Promise<boolean>;
  fetchEvent: (uuid: string) => Promise<boolean>;
};

export const SlotContext = createContext({} as SlotContextType);

interface SlotContextWrapper {
  children: React.ReactNode;
}

export const SlotContextWrapper = ({ children }: SlotContextWrapper) => {
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<EventData | null>(null);
  const [mode, setMode] = useState<"use" | "edit">("use");
  const notifications = useNotifications();
  const locale = useLocale();
  const params = useParams();
  const path = usePathname();
  const { nbrDays, nbrVisibleSlots } = useItemSizing(event);

  const fetchEvent = useCallback(async (uuid: string) => {
    try {
      const result = await getEvent(uuid as string);

      if (!result.status || !result.data) {
        throw new Error("Error while fetching the event");
      }

      setEvent(result.data);
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSlot = async (slots: null | TimeSlot[]) => {
    if (!slots || !event) {
      return false;
    }

    if (checkSlotSuperposition(slots)) {
      return false;
    }

    const creationData = slots.map((slot) => {
      const startTime = slot.start
        .setLocale(locale)
        .toUTC()
        .toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
      const endTime = slot.end
        .setLocale(locale)
        .toUTC()
        .toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");

      return {
        startTime,
        endTime,
        eventId: event.id,
      };
    });

    try {
      setLoading(true);
      await saveSlots(creationData);
      await fetchEvent(event.accessToken);

      notifications.show("Your slots have been saved", {
        severity: "success",
        autoHideDuration: 3000,
      });

      return true;
    } catch {
      notifications.show("Error while saving your slots", {
        severity: "error",
        autoHideDuration: 3000,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSlot = async (slotId: string) => {
    if (!event || !slotId) {
      return false;
    }

    try {
      setLoading(true);
      await removeSlot(slotId);
      await fetchEvent(event.accessToken);

      notifications.show("Slot deleted", {
        severity: "success",
        autoHideDuration: 3000,
      });
    } catch {
      debugger;
      notifications.show("Error while deleting the slot", {
        severity: "error",
        autoHideDuration: 3000,
      });

      return false;
    } finally {
      setLoading(false);
      return true;
    }
  };

  useEffect(() => {
    const { uuid } = params;
    const fetch = async () => {
      const result = await fetchEvent(uuid as string);
      if (!result) {
        notifications.show("Error while fetching the event", {
          severity: "error",
          autoHideDuration: 3000,
        });
      }
    };

    fetch();
  }, [params, fetchEvent, notifications]);

  useEffect(() => {
    if (path.includes("configure")) {
      setMode("edit");
    } else {
      setMode("use");
    }
  }, [path]);

  return (
    <SlotContext.Provider
      value={{
        mode,
        event,
        loading,
        deleteSlot,
        updateSlot,
        fetchEvent,
        nbrVisibleSlots,
        nbrDays,
      }}
    >
      {children}
    </SlotContext.Provider>
  );
};
