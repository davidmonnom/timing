import InfiniteCarousel from "@/components/InfiniteCarousel";
import JoinDialog from "@/components/JoinDialog";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <Stack
      height={"100%"}
      width={"100%"}
      justifyContent={"between"}
      overflow={"hidden"}
    >
      <Stack
        justifyContent={"center"}
        alignItems={"center"}
        flexGrow={1}
        padding={2}
      >
        <Typography variant={"h1"} fontWeight={"bold"} textAlign={"center"}>
          Orgzanize Events like a Pro!
        </Typography>
        <Typography
          variant={"h2"}
          fontWeight={"normal"}
          textAlign={"center"}
          mt={2}
        >
          Find a date like never before with Timing!
          <br />
          No ads, no tracking, just a simple and easy-to-use event planner.
        </Typography>
        <Stack spacing={2} direction={"row"} mt={4}>
          <Link href={"/event/new"}>
            <Button variant="contained" color="primary">
              New Event 🥳
            </Button>
          </Link>
          <JoinDialog>Join Event 🎉</JoinDialog>
        </Stack>
        <Box mt={6}>
          <Chip
            label="Made with ❤ by David Monnom"
            variant="outlined"
            size="small"
          />
        </Box>
      </Stack>
      <Box width={"100%"} position={"relative"}>
        <InfiniteCarousel />
      </Box>
    </Stack>
  );
}
