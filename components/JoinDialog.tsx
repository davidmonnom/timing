"use client";

import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Box, Button, TextField, Typography } from "@mui/material";
import { checkEvent } from "@/app/actions";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useRouter } from "next/navigation";

type JoinDialogProps = {
  children: React.ReactNode;
};

export default function JoinDialog({ children }: JoinDialogProps) {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState<string>("example-public-event");
  const notifications = useNotifications();
  const router = useRouter();

  const onClickJoin = async () => {
    try {
      const result = await checkEvent(token);

      if (!result) {
        notifications.show("Event not found", {
          severity: "warning",
          autoHideDuration: 3000,
        });

        return;
      }

      router.push(`/event/${token}`);
    } catch {
      notifications.show("An error occurred while joining the event", {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        onClick={() => setOpen(true)}
        style={{ color: "black", borderColor: "black" }}
      >
        {children}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          <Typography>Join a slot 🫢</Typography>
        </DialogTitle>
        <DialogContent>
          <Box padding={"10px 0px"}>
            <TextField
              placeholder="Token"
              label="Access Token"
              variant="outlined"
              value={token}
              onChange={(e) => setToken(e.currentTarget.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            autoFocus
            onClick={onClickJoin}
            color="primary"
            disabled={!token}
          >
            Join 🪇
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
