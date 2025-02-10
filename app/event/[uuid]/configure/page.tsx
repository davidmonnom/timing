"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import { useContext } from "react";
import { SlotContext } from "@/context/SlotContext";
import SlotPagination from "@/components/slot/SlotPagination";
import { useRouter } from "next/navigation";

export default function Configure() {
  const context = useContext(SlotContext);
  const router = useRouter();

  return (
    <Stack
      alignItems={"center"}
      justifyContent={"center"}
      height={"100%"}
      width={"100%"}
      overflow={"hidden"}
      position={"relative"}
    >
      <Stack
        width={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        spacing={2}
      >
        <Typography
          variant={"h3"}
          fontWeight={"bold"}
          textAlign={"center"}
          padding={"0px 10px"}
        >
          Configure your event
        </Typography>
        <Typography
          variant={"h4"}
          fontWeight={"normal"}
          textAlign={"center"}
          padding={"0px 10px"}
        >
          Add all the dates and times that your guests can later select. You can
          return to this screen later.
        </Typography>
        <Typography
          variant={"h4"}
          fontWeight={"normal"}
          textAlign={"center"}
          padding={"0px 10px"}
        >
          Your guests can then indicate whether or not they will be available on
          the available dates. You can sort the dates by the most popular.
        </Typography>
      </Stack>
      <Box
        flexGrow={1}
        width={"100%"}
        style={{ overflowY: "scroll" }}
        overflow={"scroll"}
      >
        {context.event && <SlotPagination event={context.event} />}
      </Box>
      <Box position={"absolute"} bottom={0} right={0} padding={"20px"}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={!context.event || context.event.slots.length === 0}
          onClick={() =>
            router.push(`/event/${context.event && context.event.accessToken}`)
          }
        >
          Continue 🎉
        </Button>
      </Box>
    </Stack>
  );
}
