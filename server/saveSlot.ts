"use server";

import { prisma } from "@/lib/prisma";
import { DateTime } from "luxon";

type SlotCreationData = {
  startTime: string;
  endTime: string;
  eventId: string;
};

type SlotReturnType = {
  status: boolean;
  error?: unknown;
};

export default async function saveSlots(
  slots: SlotCreationData[]
): Promise<SlotReturnType> {
  try {
    const dateStart = DateTime.fromISO(slots[0].startTime).set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    const dateEnd = dateStart.set({
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 999,
    });

    await prisma.slot.deleteMany({
      where: {
        eventId: slots[0].eventId,
        startTime: {
          gte: dateStart.toJSDate(),
          lte: dateEnd.toJSDate(),
        },
      },
    });

    await prisma.slot.createMany({
      data: slots,
    });

    return {
      status: true,
    };
  } catch (e) {
    return {
      status: false,
      error: e,
    };
  }
}
