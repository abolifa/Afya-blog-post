"use client";

import { api } from "@/lib/api";
import { Stats as StatsType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import CountUp from "react-countup";
import { Separator } from "./ui/separator";

const labels: Record<string, string> = {
  centers: "إجمالي عدد المراكز المسجلة",
  patients: "عدد المرضي المسجلين بالبوابة الإكلترونية",
  appointments: "إجمالي المواعيد الإفتراضية",
  orders: "إجمالي طلبات المرضى التي تم توفيتها",
  devices: "إجمالي الأجهزة",
  doctors: "إجمالي الأطباء",
};

const titles: Record<string, string> = {
  centers: "المراكز",
  patients: "المرضى",
  appointments: "المواعيد",
  orders: "طلبات المرضى",
  devices: "الأجهزة",
  doctors: "الأطباء",
};

export default function Stats() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["numbers"],
    queryFn: async () => {
      const res = await api.get(`/numbers`);
      return res.data as StatsType;
    },
  });

  if (isLoading) return <div className="text-center">جار التحميل...</div>;
  if (isError)
    return <div className="text-center text-red-500">خطأ: {error.message}</div>;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold">إحصائيات الهيئة</h1>
      <Separator />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(data ?? {}).map(([key, value]) => (
          <div
            key={key}
            className="rounded-xl flex flex-col items-center gap-2 p-4 py-5 shadow-md border bg-muted"
          >
            <h2 className="text-xl font-bold tracking-tight text-teal-500">
              {titles[key] ?? key}
            </h2>
            <div className="text-3xl font-bold">
              <CountUp end={Number(value)} duration={2} separator="," />
            </div>
            <p className="text-md text-muted-foreground">
              {labels[key] ?? key}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
