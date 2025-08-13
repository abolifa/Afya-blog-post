"use client";

import queryClient from "@/lib/client";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default AppProvider;
