import { useEffect, useState } from "react";

export default function useLocale() {
  const [locale, setLocale] = useState("en-US");

  useEffect(() => {
    setLocale(navigator.language || "en-US");
  }, []);

  return locale;
}
