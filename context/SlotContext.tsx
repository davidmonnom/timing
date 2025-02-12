"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { EventData, TimeSlot } from "@/app/types";
import useLocale from "@/hooks/useLocale";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useParams, usePathname } from "next/navigation";
import checkSlotSuperposition from "@/lib/checkSlotSuperposition";
import getEvent from "@/server/getEvent";
import saveSlots from "@/server/saveSlot";
import removeSlot from "@/server/removeSlot";
import addPeopleToSlot from "@/server/addPeopleToSlot";
import { Slot } from "@prisma/client";
import getEventSlots from "@/server/getEventSlots";

type SlotContextType = {
  name: string;
  lockName: boolean;
  event: EventData | null;
  mode: "use" | "edit";
  loading: boolean;
  setName: (name: string) => void;
  validateName: () => void;
  deleteSlot: (slotId: string) => Promise<boolean>;
  updateSlot: (slots: null | TimeSlot[]) => Promise<boolean>;
  fetchEvent: (uuid: string) => Promise<boolean>;
  subscribeToSlot: (slot: Slot) => Promise<boolean>;
};

export const SlotContext = createContext({} as SlotContextType);

interface SlotContextWrapper {
  children: React.ReactNode;
}

export const SlotContextWrapper = ({ children }: SlotContextWrapper) => {
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<EventData | null>(null);
  const [mode, setMode] = useState<"use" | "edit">("use");
  const [name, setName] = useState<string>("");
  const [lockName, setLockName] = useState<boolean>(false);
  const notifications = useNotifications();
  const locale = useLocale();
  const params = useParams();
  const path = usePathname();

  const fetchEvent = useCallback(async (uuid: string) => {
    try {
      const result = await getEvent(uuid as string);

      console.log(result);
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
      await removeSlot(slotId);
      await fetchEvent(event.accessToken);

      notifications.show("Slot deleted", {
        severity: "success",
        autoHideDuration: 3000,
      });
    } catch {
      notifications.show("Error while deleting the slot", {
        severity: "error",
        autoHideDuration: 3000,
      });

      return false;
    } finally {
      return true;
    }
  };

  const subscribeToSlot = async (slot: Slot) => {
    try {
      const result = await addPeopleToSlot({
        slotId: slot.id,
        eventId: event?.id as string,
        name: name,
      });

      if (result.status) {
        await refreshSlots();
        notifications.show("Subscribed to the slot", {
          severity: "success",
          autoHideDuration: 3000,
        });
        return true;
      }

      throw new Error("Error while subscribing to the slot");
    } catch {
      notifications.show("Error while subscribing to the slot", {
        severity: "error",
        autoHideDuration: 3000,
      });

      return false;
    }
  };

  const refreshSlots = async () => {
    if (!event) {
      return false;
    }

    try {
      const slots = await getEventSlots(event?.id as string);

      if (slots && slots.status && slots.data) {
        setEvent((prev) =>
          prev ? { ...prev, slots: slots.data ?? [] } : prev
        );
      }
    } catch {
      console.warn("Error while refreshing slots");
    }
  };

  const validateName = () => {
    localStorage.setItem("name", name);
    setLockName(true);
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

  useEffect(() => {
    const storedName = localStorage.getItem("name");

    if (storedName) {
      setName(storedName);
      setLockName(true);
    }
  }, []);

  return (
    <SlotContext.Provider
      value={{
        name,
        lockName,
        mode,
        event,
        loading,
        setName,
        deleteSlot,
        updateSlot,
        fetchEvent,
        subscribeToSlot,
        validateName,
      }}
    >
      {children}
    </SlotContext.Provider>
  );
};
