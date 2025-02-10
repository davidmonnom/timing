"use client";

import {
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { EventData } from "@/app/types";
import { DateTime } from "luxon";
import SlotHeader from "./SlotHeader";
import { SlotContext } from "@/context/SlotContext";
import SlotEditor from "./SlotEditor";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CheckIcon from "@mui/icons-material/Check";
import UserEditor from "../user/UserEditor";
import {
  ITEM_CONTAINER_SPACING_PX,
  ITEM_WIDTH_PX,
} from "@/hooks/useItemSizing";

type SlotPaginationProps = {
  event: EventData;
};

export default function SlotPagination({ event }: SlotPaginationProps) {
  const context = useContext(SlotContext);
  const nbrVisibleSlots = context.nbrVisibleSlots;
  const [page, setPage] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [lockName, setLockName] = useState<boolean>(false);

  const changePage = (newPage: number) => {
    if (newPage < 0 || newPage * context.nbrVisibleSlots > context.nbrDays) {
      return;
    }

    setPage(newPage);
  };

  const getItems = () => {
    const items = [];

    for (let i = 0; i < nbrVisibleSlots; i++) {
      items.push(i + page * nbrVisibleSlots);
    }

    return items;
  };

  const validateName = () => {
    localStorage.setItem("name", name);
    setLockName(true);
  };

  useEffect(() => {
    const storedName = localStorage.getItem("name");

    if (storedName) {
      setName(storedName);
      setLockName(true);
    }
  }, []);

  return (
    <Stack
      margin={"20px"}
      style={{ overflowX: "scroll" }}
      alignItems={"center"}
      spacing={2}
    >
      <Stack direction={"row"} spacing={1}>
        <Box
          border={"1px solid"}
          borderColor={"primary.light"}
          borderRadius={"5px"}
          color="primary.dark"
          padding={"0px 10px"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Typography fontSize={"small"} fontWeight={"bold"}>
            {event.slots.length} slots
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          color="primary"
          style={{ padding: "5px", minWidth: "0" }}
          disabled={page === 0}
          onClick={() => changePage(page - 1)}
        >
          <KeyboardArrowLeftIcon />
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="primary"
          style={{ padding: "5px", minWidth: "0" }}
          disabled={
            page * context.nbrVisibleSlots + context.nbrVisibleSlots >=
            context.nbrDays
          }
          onClick={() => changePage(page + 1)}
        >
          <KeyboardArrowRightIcon />
        </Button>
        {context.mode === "use" && (
          <>
            <TextField
              placeholder="Who are you?"
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={lockName}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">👫</InputAdornment>
                  ),
                },
              }}
            />
            <Button
              variant="outlined"
              size="small"
              color="primary"
              style={{ padding: "5px", minWidth: "0" }}
              disabled={name.length === 0 || lockName}
              onClick={validateName}
            >
              <CheckIcon />
            </Button>
          </>
        )}
      </Stack>
      <Stack direction={"row"} spacing={`${ITEM_CONTAINER_SPACING_PX}px`}>
        {getItems().map((_, index) => {
          const offset = page * nbrVisibleSlots;
          const date = DateTime.fromJSDate(event.dateStart).plus({
            days: index + offset,
          });

          return (
            <Stack key={index} width={`${ITEM_WIDTH_PX}px`}>
              <SlotHeader date={date} />
              {context.mode === "edit" ? (
                <SlotEditor
                  event={event}
                  index={index}
                  offset={offset}
                  date={date}
                />
              ) : (
                <UserEditor event={event} index={index} offset={offset} />
              )}
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}
