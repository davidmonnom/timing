import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useEffect, useState } from "react";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { TimeSlot } from "@/app/types";
import checkSlotSuperposition from "@/lib/checkSlotSuperposition";
import { Slot } from "@prisma/client";

type SlotDialogProps = {
  date: DateTime;
  children: React.ReactNode;
  existingSlots: Slot[];
  onClose: (slots: null | TimeSlot[]) => Promise<boolean>;
};

export default function SlotDialog({
  date,
  children,
  existingSlots,
  onClose,
}: SlotDialogProps) {
  const [open, setOpen] = useState(false);
  const [nbrSlots, setNbrSlots] = useState<number>(0);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  const handleClose = () => {
    setOpen(false);
    onClose(timeSlots);
  };

  const cancel = () => {
    setOpen(false);
    onClose(null);
  };

  const setTimeSlot = (index: number, timeSlot: TimeSlot) => {
    const newTimesSlot = [...timeSlots];
    newTimesSlot[index] = timeSlot;
    setTimeSlots(newTimesSlot);
  };

  const addSlot = () => {
    const lastSlot = timeSlots[timeSlots.length - 1];
    const start = lastSlot.end.plus({ minutes: 1 });
    const end = start.plus({ hours: 1 });
    setNbrSlots(nbrSlots + 1);
    setTimeSlots([
      ...timeSlots,
      {
        start: start,
        end: end,
      },
    ]);
  };

  const deleteSlot = (index: number) => {
    const newTimesSlot = [...timeSlots];
    newTimesSlot.splice(index, 1);
    setTimeSlots(newTimesSlot);
    setNbrSlots(nbrSlots - 1);
  };

  useEffect(() => {
    const slots: TimeSlot[] = [];
    if (!existingSlots.length) {
      slots.push({
        start: date.set({ hour: 7, minute: 0 }),
        end: date.set({ hour: 8, minute: 0 }),
      });
    } else {
      slots.push(
        ...existingSlots.map((slot) => {
          return {
            start: DateTime.fromJSDate(slot.startTime),
            end: DateTime.fromJSDate(slot.endTime),
          };
        })
      );
    }

    setTimeSlots(slots);
    setNbrSlots(slots.length);
  }, [existingSlots, date]);

  const checkAllSlotsSameDay = (slots: TimeSlot[]) => {
    const dd = date.day;
    return !slots.every((slot) => {
      return slot.start.day === dd && slot.end.day === dd;
    });
  };

  return (
    <>
      <Button variant="outlined" size="small" onClick={() => setOpen(true)}>
        {children}
      </Button>
      <Dialog open={open} onClose={cancel}>
        <DialogTitle>
          <Typography>Add slot for {date.toLocaleString()}</Typography>
        </DialogTitle>
        <DialogContent>
          {checkSlotSuperposition(timeSlots) && (
            <Box marginBottom={"10px"}>
              <Alert severity="warning">
                Warning, some slots are in superposition
              </Alert>
            </Box>
          )}
          {checkAllSlotsSameDay(timeSlots) && (
            <Box marginBottom={"10px"}>
              <Alert severity="warning">
                Warning, all slots must be on the same day
              </Alert>
            </Box>
          )}
          {new Array(nbrSlots).fill(0).map((_, index) => (
            <Stack
              spacing={2}
              direction={"row"}
              margin={"10px 0"}
              key={index}
              marginTop={"20px"}
            >
              <TimePicker
                label="Start time"
                value={timeSlots[index].start}
                slotProps={{ textField: { size: "small" } }}
                onChange={(newValue) => {
                  if (!newValue) {
                    return;
                  }

                  setTimeSlot(index, {
                    start: newValue,
                    end: timeSlots[0].end,
                  });
                }}
              />
              <TimePicker
                label="End time"
                value={timeSlots[index].end}
                slotProps={{ textField: { size: "small" } }}
                onChange={(newValue) => {
                  if (!newValue) {
                    return;
                  }

                  setTimeSlot(index, {
                    start: timeSlots[0].start,
                    end: newValue,
                  });
                }}
              />
              <Button
                onClick={() => deleteSlot(index)}
                color="error"
                variant="outlined"
                size="small"
                disabled={nbrSlots === 1}
              >
                <DeleteOutlineIcon />
              </Button>
            </Stack>
          ))}
          <Button color="primary" onClick={addSlot} variant="outlined">
            Add slot
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancel} color="primary">
            Cancel
          </Button>
          <Button
            autoFocus
            onClick={handleClose}
            color="primary"
            disabled={
              checkSlotSuperposition(timeSlots) ||
              checkAllSlotsSameDay(timeSlots)
            }
          >
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
