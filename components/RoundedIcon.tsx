import { Box } from "@mui/material";

type RoundedIconProps = {
  action?: () => void;
  children: React.ReactNode;
};

export default function RoundedIcon({ action, children }: RoundedIconProps) {
  return (
    <Box>
      <Box
        bgcolor={"primary.main"}
        color={"white"}
        borderRadius={"999px"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        p={"2px"}
        style={{ cursor: "pointer" }}
        onClick={action}
      >
        {children}
      </Box>
    </Box>
  );
}
