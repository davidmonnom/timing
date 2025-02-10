"use server";

import { prisma } from "@/lib/prisma";
import { Event } from "@prisma/client";

type Data = {
  name: string;
  description: string;
  ownerEmail: string;
  dateStart: string;
  dateEnd: string;
};

type ReturnType<T extends boolean> = T extends true
  ? { status: true; data: Event; error?: never }
  : { status: false; data?: never; error: unknown };

export default async function createEvent(
  data: Data
): Promise<ReturnType<true> | ReturnType<false>> {
  try {
    const result = await prisma.event.create({
      data: {
        ...data,
      },
    });

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
