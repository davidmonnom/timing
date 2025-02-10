import { TimeSlot } from "@/app/types";

const checkSlotSuperposition = (timeSlots: TimeSlot[]) => {
  for (let i = 0; i < timeSlots.length; i++) {
    for (let j = i + 1; j < timeSlots.length; j++) {
      if (
        (timeSlots[i].start <= timeSlots[j].start &&
          timeSlots[j].start <= timeSlots[i].end) ||
        (timeSlots[i].start <= timeSlots[j].end &&
          timeSlots[j].end <= timeSlots[i].end)
      ) {
        return true;
      }
    }
  }
  return false;
};

export default checkSlotSuperposition;
