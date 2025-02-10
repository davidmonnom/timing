"use client";

import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useContext } from "react";
import { SlotContext } from "@/context/SlotContext";
import SlotPagination from "@/components/slot/SlotPagination";

export default function New() {
  const context = useContext(SlotContext);

  return (
    <Stack
      alignItems={"center"}
      justifyContent={"center"}
      height={"100%"}
      width={"100%"}
      spacing={2}
    >
      {context.loading && (
        <Stack
          width={"100%"}
          justifyContent={"center"}
          height={"100%"}
          alignItems={"center"}
        >
          <CircularProgress />
        </Stack>
      )}
      {context.event && (
        <>
          <Stack
            width={"100%"}
            justifyContent={"center"}
            alignItems={"center"}
            spacing={2}
          >
            <Typography variant={"h3"} fontWeight={"bold"} textAlign={"center"}>
              {`Welcome to «${context.event.name}!»`}
            </Typography>
            <Typography
              variant={"h4"}
              fontWeight={"normal"}
              textAlign={"center"}
              padding={"0px 10px"}
            >
              {context.event.description}
            </Typography>
          </Stack>
          <Box flexGrow={1} width={"100%"}>
            {context.event && <SlotPagination event={context.event} />}
          </Box>
        </>
      )}
    </Stack>
  );
}
