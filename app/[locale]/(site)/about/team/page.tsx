"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { PropagateLoader } from "react-spinners";

import ErrorComponent from "@/components/error-component";
import { api } from "@/lib/api";
import { TeamsResponse } from "@/lib/types";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users } from "lucide-react";

export default function TeamPage() {
  const locale = useLocale();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => (await api.get("/teams")).data as TeamsResponse,
    retry: 1,
  });

  return (
    <div className="space-y-5">
      <nav className="text-sm text-muted-foreground mb-1">
        <Link href="/">الرئيسية</Link>
        <span className="mx-1">/</span>
        <Link href={`/${locale}/about/team`}>فريق العمل</Link>
      </nav>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <PropagateLoader
            color="#4A5568"
            loading
            size={15}
            aria-label="Loading Spinner"
          />
        </div>
      ) : isError ? (
        <ErrorComponent error={error} />
      ) : (
        <>
          <h2 className="text-xl font-bold">{data?.teams_title}</h2>
          {data?.teams_description && (
            <div
              className="text-justify leading-loose"
              dangerouslySetInnerHTML={{ __html: data.teams_description }}
            />
          )}

          <Separator />

          {data?.team_members?.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.team_members.map((team, idx) => (
                <Card
                  key={`${team.team_member_name}-${idx}`}
                  className="border bg-card/80"
                >
                  <CardHeader className="flex flex-row items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-lg bg-teal-100 text-teal-700">
                        <Users className="w-5 h-5" />
                      </span>
                      <CardTitle className="text-base">
                        {team.team_member_name}
                      </CardTitle>
                    </div>
                    <Badge variant="secondary">
                      {(team.team_members_members?.length ?? 0).toLocaleString(
                        "ar"
                      )}
                      &nbsp;عضو
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    {team.team_members_members?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {team.team_members_members.map((memberName, i) => (
                          <Badge
                            key={`${team.team_member_name}-${memberName}-${i}`}
                            variant="outline"
                          >
                            {memberName}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        لا يوجد أعضاء مسجَّلون لهذا الفريق.
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              لا توجد فرق مُسجّلة حتى الآن.
            </p>
          )}
        </>
      )}
    </div>
  );
}
