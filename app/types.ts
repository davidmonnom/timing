import { Event, Slot, SlotsPeople } from "@prisma/client";
import { DateTime } from "luxon";

export type SlotsPeopleData = SlotsPeople & {
  people: {
    name: string;
  };
};

export type SlotData = Slot & {
  slotsPeople: SlotsPeopleData[];
};

export type EventData = Event & {
  slots: SlotData[];
};

export type TimeSlot = {
  start: DateTime;
  end: DateTime;
};
