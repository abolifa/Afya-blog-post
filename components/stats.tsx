"use client";

import { api } from "@/lib/api";
import { Stats as StatsType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import CountUp from "react-countup";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Building,
  CalendarDays,
  Computer,
  Package,
  Stethoscope,
  Users,
} from "lucide-react";

const labels: Record<string, string> = {
  centers: "إجمالي عدد المراكز المسجلة",
  patients: "عدد المستفيدين المسجلين بالبوابة الإكلترونية",
  appointments: "إجمالي المواعيد الإفتراضية",
  orders: "إجمالي طلبات المرضى التي تم توفيتها",
  devices: "إجمالي الأجهزة",
  doctors: "إجمالي الأطباء",
};

const titles: Record<string, string> = {
  centers: "المراكز",
  patients: "المستفيدين من الخدمات",
  appointments: "المواعيد",
  orders: "طلبات المرضى",
  devices: "الأجهزة",
  doctors: "الأطباء",
};

const icons: Record<string, React.ReactNode> = {
  centers: <Building />,
  patients: <Users />,
  appointments: <CalendarDays />,
  orders: <Package />,
  devices: <Computer />,
  doctors: <Stethoscope />,
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(data ?? {}).map(([key, value]) => (
          <Card key={key} className="gap-2">
            <CardHeader className="flex items-center justify-center gap-2">
              <div className="text-muted-foreground">{icons[key]}</div>
              <CardTitle className="text-teal-500 text-base text-ellipsis font-bold">
                {titles[key] ?? key}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center text-3xl font-bold">
              <CountUp end={Number(value)} duration={2} separator="," />
            </CardContent>
            <CardFooter className="flex items-center justify-center">
              <CardDescription>{labels[key] ?? key}</CardDescription>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
