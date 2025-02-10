"use client";

import { Stack, Typography } from "@mui/material";
import { useContext } from "react";
import { EventData } from "@/app/types";
import { DateTime } from "luxon";
import getDateSlots from "@/lib/getDateSlot";
import SlotDialog from "./SlotDialog";
import SlotItem from "./SlotItem";
import { SlotContext } from "@/context/SlotContext";
import { Slot } from "@prisma/client";

type SlotEditorProps = {
  event: EventData;
  index: number;
  offset: number;
  date: DateTime;
};

export default function SlotEditor({
  event,
  index,
  offset,
  date,
}: SlotEditorProps) {
  const context = useContext(SlotContext);

  return (
    <Stack mt={"15px"} justifyContent={"center"} spacing={1}>
      <SlotDialog
        onClose={context.updateSlot}
        date={date}
        existingSlots={getDateSlots(index, offset, event)}
      >
        {getDateSlots(index, offset, event).length === 0
          ? "Add slot"
          : "Edit slots"}
      </SlotDialog>

      {getDateSlots(index, offset, event).map((slot: Slot) => (
        <SlotItem key={slot.id} slot={slot} onDelete={context.deleteSlot} />
      ))}
      {getDateSlots(index, offset, event).length === 0 && (
        <Stack
          border={"1px solid"}
          padding={"5px"}
          borderRadius={"5px"}
          justifyContent={"center"}
          alignItems={"center"}
          style={{ opacity: 0.4 }}
        >
          <Typography fontSize={"0.8rem"}>Nothing 😒</Typography>
        </Stack>
      )}
    </Stack>
  );
}
