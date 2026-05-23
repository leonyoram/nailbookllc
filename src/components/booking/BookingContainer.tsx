"use client";

import { useEffect } from "react";
import { useLanguageStore } from "@/store/useLanguageStore";
import { BookingWizard } from "./BookingWizard";

export function BookingContainer({ tenant }: { tenant: any }) {
  const { setLanguage } = useLanguageStore();

  useEffect(() => {
    if (tenant.locale) {
      setLanguage(tenant.locale as any);
    }
  }, [tenant.locale, setLanguage]);

  return <BookingWizard tenant={tenant} />;
}
