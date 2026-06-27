"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { MobileAppStackValue } from "./use-mobile-app-stack";

const MobileAppStackContext = createContext<MobileAppStackValue | null>(null);

export function MobileAppStackProvider({
  value,
  children,
}: {
  value: MobileAppStackValue;
  children: ReactNode;
}) {
  return (
    <MobileAppStackContext.Provider value={value}>{children}</MobileAppStackContext.Provider>
  );
}

export function useMobileAppStackContext(): MobileAppStackValue | null {
  return useContext(MobileAppStackContext);
}
