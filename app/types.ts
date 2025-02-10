import { Event, Slot } from "@prisma/client";
import { DateTime } from "luxon";

export type EventData = Event & {
  slots: Slot[];
};

export type TimeSlot = {
  start: DateTime;
  end: DateTime;
};
