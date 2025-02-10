import { EventData } from "@/app/types";
import { Slot } from "@prisma/client";
import { DateTime } from "luxon";

const getDateSlots = (index: number, offset: number, event: EventData) => {
  const realDate = (date: Date) =>
    DateTime.fromJSDate(date).set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

  return event.slots.filter((slot: Slot) => {
    const dateStart = realDate(slot.startTime);
    const eventDate = realDate(event.dateStart);

    return dateStart.equals(eventDate.plus({ days: index + offset }));
  });
};

export default getDateSlots;
