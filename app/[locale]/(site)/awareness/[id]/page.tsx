"use client";

import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { getImageUrl } from "@/lib/helpers";
import { Awareness } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";

const page = () => {
  const { id } = useParams();
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["awareness", id],
    queryFn: async () => {
      const res = await api.get(`/awareness/${id}`);
      return res.data as Awareness;
    },
  });
  return (
    <div className="w-full space-y-5">
      <h1 className="text-2xl font-bold">التوعيات الصحية</h1>
      <Separator />
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">{data?.title}</h2>
          <p
            className="text-justify leading-relaxed px-5"
            dangerouslySetInnerHTML={{ __html: data?.description ?? "" }}
          ></p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {data?.attachments?.map((attachment) => (
              <div key={attachment.title} className="border p-4 rounded">
                <h3 className="font-semibold mb-2">{attachment.title}</h3>
                <Image
                  src={getImageUrl(attachment.image)}
                  alt={attachment.title}
                  className="aspect-square"
                  width={500}
                  height={300}
                  priority
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
