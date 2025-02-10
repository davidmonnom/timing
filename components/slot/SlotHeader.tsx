import { Stack, Typography } from "@mui/material";
import { DateTime } from "luxon";

type SlotHeaderProps = {
  date: DateTime;
};

export default function SlotHeader({ date }: SlotHeaderProps) {
  return (
    <Stack
      direction={"column"}
      spacing={1}
      alignItems={"center"}
      justifyContent={"center"}
      padding={"10px"}
      borderRadius={"5px"}
      border={"1px solid"}
      borderColor="primary.main"
    >
      <Typography fontWeight={"light"}>{date.toFormat("ccc")}</Typography>
      <Typography
        color="primary"
        fontWeight={"bold"}
        fontSize={{ xs: "1.5rem", md: "2rem" }}
      >
        {date.toFormat("dd")}
      </Typography>
      <Typography padding={"0 10px"} noWrap={true} fontWeight={"light"}>
        {date.toFormat("LLLL")}
      </Typography>
    </Stack>
  );
}
