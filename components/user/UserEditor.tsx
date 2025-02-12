import { Stack, Typography } from "@mui/material";
import { EventData, SlotData } from "@/app/types";
import getDateSlots from "@/lib/getDateSlot";
import SlotItem from "../slot/SlotItem";

type UserEditorProps = {
  event: EventData;
  index: number;
  offset: number;
};

export default function UserEditor({ event, index, offset }: UserEditorProps) {
  return (
    <Stack mt={"15px"} justifyContent={"center"} spacing={1}>
      {getDateSlots(index, offset, event).map((slot: SlotData) => (
        <SlotItem key={slot.id} slot={slot} />
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
