"use server";

import { prisma } from "@/lib/prisma";

type SlotReturnType = {
  status: boolean;
  error?: unknown;
};

export async function removeSlot(slotId: string): Promise<SlotReturnType> {
  try {
    await prisma.slot.delete({
      where: {
        id: slotId,
      },
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
