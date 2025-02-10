"use server";

import { prisma } from "@/lib/prisma";

export async function checkEvent(accessToken: string): Promise<boolean> {
  try {
    const result = await prisma.event.count({
      where: {
        accessToken: accessToken,
      },
    });

    return result > 0;
  } catch {
    return false;
  }
}
