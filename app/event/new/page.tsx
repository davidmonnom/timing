"use client";

import {
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Form from "next/form";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import Link from "next/link";
import useLocale from "@/hooks/useLocale";
import { useNotifications } from "@toolpad/core/useNotifications";
import createEvent from "@/server/createEvent";
import { useRouter } from "next/navigation";
import InfiniteCarousel from "@/components/InfiniteCarousel";

export default function New() {
  const locale = useLocale();
  const notifications = useNotifications();
  const router = useRouter();

  const create = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const ownerEmail = formData.get("ownerEmail") as string;
    const dateStart = formData.get("dateStart") as string;
    const dateEnd = formData.get("dateEnd") as string;
    const start = DateTime.fromFormat(dateStart, "dd/MM/yyyy", { locale })
      .toUTC()
      .toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
    const end = DateTime.fromFormat(dateEnd, "dd/MM/yyyy", { locale })
      .toUTC()
      .toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");

    const result = await createEvent({
      name,
      description,
      ownerEmail,
      dateStart: start,
      dateEnd: end,
    });

    if (result.status) {
      router.push(`/event/${result.data.accessToken}/configure`);
      return;
    }

    notifications.show("Error during event creation", {
      severity: "error",
      autoHideDuration: 3000,
    });
  };

  return (
    <Stack
      alignItems={"center"}
      justifyContent={"center"}
      height={"100%"}
      width={"100%"}
    >
      <Stack
        flexGrow={1}
        justifyContent={"center"}
        width={"100%"}
        alignItems={"center"}
        spacing={{
          xs: 3,
          sm: 5,
        }}
      >
        <Box padding={"0px 20px"}>
          <Typography variant={"h1"} fontWeight={"bold"} textAlign={"center"}>
            {`Let's create!`}
          </Typography>
          <Typography variant={"h2"} fontWeight={"normal"} textAlign={"center"}>
            Try to be as descriptive as possible so your guests know what to
            expect when they arrive. <br />
            You will receive a link to share with your friends and family.
          </Typography>
        </Box>
        <Form
          action={create}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Stack
            alignItems={"center"}
            spacing={2}
            direction={"column"}
            width={{
              xs: "95%",
              sm: "60%",
            }}
          >
            <Box width={"100%"}>
              <TextField
                fullWidth={true}
                variant="outlined"
                placeholder="My awesome party"
                required={true}
                name="name"
                slotProps={{
                  input: {
                    style: { borderRadius: "13px" },
                    startAdornment: (
                      <InputAdornment position="start">🎉</InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
            <Box width={"100%"}>
              <TextField
                fullWidth={true}
                variant="outlined"
                name="description"
                placeholder="Tell your guests what's happening"
                multiline={true}
                required={true}
                rows={4}
                slotProps={{
                  input: {
                    style: { borderRadius: "13px" },
                  },
                }}
              />
            </Box>
            <Box width={"100%"}>
              <TextField
                fullWidth={true}
                variant="outlined"
                placeholder="david@monnom.be"
                name="ownerEmail"
                required={true}
                slotProps={{
                  input: {
                    style: { borderRadius: "13px" },
                  },
                }}
              />
            </Box>
            <Stack
              direction={"row"}
              spacing={2}
              justifyContent={"center"}
              width={"100%"}
            >
              <DatePicker
                label="Start Range"
                defaultValue={DateTime.now()}
                name="dateStart"
              />
              <DatePicker
                label="End Range"
                defaultValue={DateTime.now().plus({ weeks: 1 })}
                name="dateEnd"
              />
            </Stack>
          </Stack>
          <Stack
            direction={"row"}
            spacing={2}
            width={"100%"}
            justifyContent={"center"}
            mt={5}
          >
            <Button
              variant="contained"
              style={{ borderRadius: "20px" }}
              color="primary"
              type="submit"
            >
              Create and configure 🥳
            </Button>
            <Link href={"/"}>
              <Button
                variant="outlined"
                style={{
                  color: "black",
                  borderColor: "black",
                  borderRadius: "20px",
                }}
              >
                Cancel 😔
              </Button>
            </Link>
          </Stack>
        </Form>
      </Stack>
      <Box width={"100%"} position={"relative"}>
        <InfiniteCarousel />
      </Box>
    </Stack>
  );
}
