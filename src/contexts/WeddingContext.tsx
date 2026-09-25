"use client";
import React, { createContext, useContext } from "react";
import type { Wedding, Guest, GuestMessage } from "@/types/wedding";

export interface WeddingContextData {
  wedding: Wedding;
  guest: Guest | null;
  messages: GuestMessage[];
}

const WeddingContext = createContext<WeddingContextData | null>(null);

export function WeddingProvider({ children, value }: { children: React.ReactNode; value: WeddingContextData }) {
  return <WeddingContext.Provider value={value}>{children}</WeddingContext.Provider>;
}

export function useWedding(): WeddingContextData {
  const ctx = useContext(WeddingContext);
  if (!ctx) throw new Error("useWedding must be used inside WeddingProvider");
  return ctx;
}
