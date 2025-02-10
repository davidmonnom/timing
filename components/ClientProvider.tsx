"use client";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { NotificationsProvider } from '@toolpad/core/useNotifications';
import { useEffect, useState } from "react";

type ClientProviderProps = {
  children: React.ReactNode;
};

export default function ClientProvider({ children }: ClientProviderProps) {
  const [locale, setLocale] = useState("en-US");

  useEffect(() => {
    setLocale(navigator.language || "en-US");
  }, []);

  return (
    <NotificationsProvider>
      <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={locale}>
        {children}
      </LocalizationProvider>
    </NotificationsProvider>
  );
}
