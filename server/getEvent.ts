"use server";

import { EventData } from "@/app/types";
import { prisma } from "@/lib/prisma";

type EventReturnType = {
  status: boolean;
  data?: EventData;
  error?: unknown;
};

export default async function getEvent(uuid: string): Promise<EventReturnType> {
  try {
    const result = await prisma.event.findUnique({
      where: {
        accessToken: uuid,
      },
      include: {
        slots: true,
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
