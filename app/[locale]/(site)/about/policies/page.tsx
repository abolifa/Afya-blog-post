"use client";

import ErrorComponent from "@/components/error-component";
import { api } from "@/lib/api";
import { HealthPolicyResponse, VisionResponse } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import Link from "next/link";
import React from "react";
import { PropagateLoader } from "react-spinners";

const page = () => {
  const locale = useLocale();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["health-policy"],
    queryFn: async () => {
      const res = await api.get("/health-policy");
      return res.data as HealthPolicyResponse;
    },
  });
  return (
    <div className="space-y-5">
      <div>
        <nav className="text-sm text-muted-foreground mb-1">
          <Link href="/">الرئيسية</Link>
          <span className="mx-1">/</span>
          <Link href={`/${locale}/about/policies`}>السياسات الصحية</Link>
        </nav>
      </div>

      <div className="space-y-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <PropagateLoader
              color="#4A5568"
              loading={isLoading}
              cssOverride={{}}
              size={15}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : isError ? (
          <ErrorComponent error={error} />
        ) : (
          <>
            <h2 className="text-xl font-bold">{data?.health_policy_title}</h2>
            <div
              className="text-justify leading-loose pl-10"
              dangerouslySetInnerHTML={{
                __html: data?.health_policy_description ?? "",
              }}
            ></div>
          </>
        )}
      </div>
    </div>
  );
};

export default page;
