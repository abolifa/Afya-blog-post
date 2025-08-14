"use client";

import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { getImageUrl } from "@/lib/helpers";
import { Awareness } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";

export default function AwarenessPage() {
  const { id } = useParams() as { id: string };

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["awareness", id],
    queryFn: async () => (await api.get(`/awareness/${id}`)).data as Awareness,
    retry: 1,
  });

  const attachments = React.useMemo(
    () =>
      Array.isArray(data?.attachments)
        ? data!.attachments.filter(
            (a: any) =>
              a && typeof a.image === "string" && a.image.trim().length > 0
          )
        : [],
    [data?.attachments]
  );

  return (
    <div className="w-full space-y-5">
      <h1 className="text-2xl font-bold">التوعيات الصحية</h1>
      <Separator />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-red-600">
          Error: {String((error as any)?.message ?? "Unknown")}
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {data?.title && (
            <h2 className="text-xl font-semibold text-teal-600">
              {data.title}
            </h2>
          )}

          {data?.description && (
            <div
              className="text-justify leading-relaxed"
              // consider sanitizing HTML on the server or with a client sanitizer
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          )}

          {attachments.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {attachments.map((att: any, idx: number) => (
                <figure
                  key={att.id ?? `${att.title ?? "att"}-${idx}`}
                  className="border rounded-xl overflow-hidden bg-card"
                >
                  <div className="relative w-full aspect-square">
                    <Image
                      src={getImageUrl(att.image)}
                      alt={att.title ?? `صورة توعوية ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                      priority={idx === 0}
                      sizes="(max-width: 1280px) 50vw, 25vw"
                    />
                  </div>
                  {att.title && (
                    <figcaption className="p-3 text-sm text-muted-foreground">
                      {att.title}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
