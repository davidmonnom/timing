import { Box } from "@mui/material";
import Image from "next/image";

type StyledImageProps = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

export default function StyledImage({
  url,
  width,
  height,
  alt,
}: StyledImageProps) {
  return (
    <Box
      width={width}
      height={height}
      overflow={"hidden"}
      flexShrink={0}
      position={"relative"}
      margin={"0px 7px"}
    >
      <Image
        src={url}
        alt={alt}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: "cover", borderRadius: "25px 25px 0px 0px" }}
        fill
        priority
      />
    </Box>
  );
}
