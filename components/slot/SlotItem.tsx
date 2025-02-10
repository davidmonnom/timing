"use client";

import { Box, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { DateTime } from "luxon";
import { Slot } from "@prisma/client";
import ClearIcon from "@mui/icons-material/Clear";
import { SlotContext } from "@/context/SlotContext";

type SlotItemProps = {
  slot?: Slot;
  onDelete: (id: string) => void;
};

export default function SlotItem({ slot, onDelete }: SlotItemProps) {
  const [end, setEnd] = useState<DateTime>();
  const [start, setStart] = useState<DateTime>();
  const context = useContext(SlotContext);

  useEffect(() => {
    if (!slot) {
      return;
    }

    setEnd(DateTime.fromJSDate(slot.endTime));
    setStart(DateTime.fromJSDate(slot.startTime));
  }, [slot]);

  return (
    <Stack
      border={"1px solid"}
      padding={"5px"}
      borderRadius={"5px"}
      justifyContent={"center"}
      alignItems={"center"}
      position={"relative"}
      style={{ opacity: slot ? 1 : 0.15 }}
    >
      {end && start && (
        <Typography fontSize={"0.8rem"}>
          {start.toFormat("HH:mm")} - {end.toFormat("HH:mm")}
        </Typography>
      )}
      {context.mode === "edit" && (
        <Box
          position={"absolute"}
          top={-7}
          right={-7}
          bgcolor={"primary.main"}
          color={"white"}
          borderRadius={"999px"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          p={"2px"}
          style={{ cursor: "pointer" }}
          onClick={() => slot && onDelete(slot.id)}
        >
          <ClearIcon
            style={{
              fontSize: "11px",
            }}
          />
        </Box>
      )}
    </Stack>
  );
}
