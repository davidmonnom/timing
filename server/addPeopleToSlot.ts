"use server";

import { prisma } from "@/lib/prisma";

type AddPeopleToEventCreationData = {
  slotId: string;
  eventId: string;
  name: string;
};

type SlotReturnType = {
  status: boolean;
  error?: unknown;
};

export default async function addPeopleToEvent(
  data: AddPeopleToEventCreationData
): Promise<SlotReturnType> {
  try {
    let person = await prisma.people.findFirst({
      where: {
        eventId: data.eventId,
        name: data.name,
      },
    });

    if (!person) {
      person = await prisma.people.create({
        data: {
          name: data.name,
          eventId: data.eventId,
        },
      });
    }

    const exist = await prisma.slotsPeople.findFirst({
      where: {
        slotId: data.slotId,
        peopleId: person.id,
      },
    });

    if (exist) {
      await prisma.slotsPeople.delete({
        where: {
          id: exist.id,
        },
      });
      return {
        status: true,
      };
    }

    await prisma.slotsPeople.create({
      data: {
        slotId: data.slotId,
        peopleId: person.id,
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
