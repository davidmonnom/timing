"use client";

import { Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { DateTime } from "luxon";
import ClearIcon from "@mui/icons-material/Clear";
import { SlotContext } from "@/context/SlotContext";
import RoundedIcon from "../RoundedIcon";
import { SlotData } from "@/app/types";

type SlotItemProps = {
  slot?: SlotData;
};

export default function SlotItem({ slot }: SlotItemProps) {
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

  const subscibeToSlot = async () => {
    if (context.mode === "edit" || !slot) {
      return;
    }

    await context.subscribeToSlot(slot);
  };

  return (
    <Stack
      border={"1px solid"}
      padding={"5px"}
      borderRadius={"5px"}
      justifyContent={"center"}
      alignItems={"center"}
      position={"relative"}
      onClick={subscibeToSlot}
      spacing={1}
      style={{
        cursor: context.mode === "use" ? "pointer" : "default",
        opacity: slot ? 1 : 0.15,
      }}
    >
      {end && start && slot && (
        <>
          <Stack
            width={"100%"}
            direction={"row"}
            spacing={1}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography fontSize={"0.8rem"} fontWeight={"bold"}>
              {start.toFormat("HH:mm")} - {end.toFormat("HH:mm")}
            </Typography>
            {context.mode === "edit" && (
              <RoundedIcon action={() => context.deleteSlot(slot.id)}>
                <ClearIcon
                  style={{
                    fontSize: "11px",
                  }}
                />
              </RoundedIcon>
            )}
          </Stack>
          {context.mode === "use" && slot.slotsPeople.length > 0 && (
            <Stack
              width={"100%"}
              alignItems={"center"}
              direction={"column"}
              spacing={"3px"}
            >
              {slot.slotsPeople.map((slotPerson) => (
                <Typography
                  textAlign={"center"}
                  key={slotPerson.id}
                  fontSize={"0.8rem"}
                  borderRadius={"5px"}
                  width={"100%"}
                  color={
                    slotPerson.people.name === context.name
                      ? "white"
                      : "primary.main"
                  }
                  bgcolor={
                    slotPerson.people.name === context.name
                      ? "primary.main"
                      : "#ffeef5"
                  }
                >
                  {slotPerson.people.name}
                </Typography>
              ))}
            </Stack>
          )}
        </>
      )}
    </Stack>
  );
}
