import { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Assistant as Font } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { Box } from "@mui/material";
import ClientProvider from "@/components/ClientProvider";

const font = Font({
  variable: "--primary-font",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Timing",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.variable} style={{ margin: 0 }}>
        <AppRouterCacheProvider>
          <ClientProvider>
            <ThemeProvider theme={theme}>
              <Box height={"100vh"} width={"100%"}>
                {children}
              </Box>
            </ThemeProvider>
          </ClientProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
