"use server";

import { SlotData } from "@/app/types";
import { prisma } from "@/lib/prisma";

type SlotsReturnType = {
  status: boolean;
  data?: SlotData[];
  error?: unknown;
};

export default async function getEventSlots(
  eventId: string
): Promise<SlotsReturnType> {
  try {
    const result = await prisma.slot.findMany({
      where: {
        eventId: eventId,
      },
      include: {
        slotsPeople: {
          include: {
            people: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!result) {
      return {
        status: false,
        error: "Event not found",
      };
    }

    return {
      status: true,
      data: result,
    };
  } catch (e) {
    return {
      status: false,
      error: e,
    };
  }
}
