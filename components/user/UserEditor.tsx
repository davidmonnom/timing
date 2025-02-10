"use client";

import { Stack, Typography } from "@mui/material";
import { useContext } from "react";
import { EventData } from "@/app/types";
import getDateSlots from "@/lib/getDateSlot";
import { SlotContext } from "@/context/SlotContext";
import { Slot } from "@prisma/client";
import SlotItem from "../slot/SlotItem";

type UserEditorProps = {
  event: EventData;
  index: number;
  offset: number;
};

export default function UserEditor({ event, index, offset }: UserEditorProps) {
  const context = useContext(SlotContext);

  return (
    <Stack mt={"15px"} justifyContent={"center"} spacing={1}>
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
