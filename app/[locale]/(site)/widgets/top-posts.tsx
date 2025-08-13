"use client";

import { api } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MoveLeft, MoveRight } from "lucide-react";
import { useLocale } from "next-intl";
import React from "react";
import { usePathname, useRouter, Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { LaravelPage, Post } from "@/lib/types";
import PostContainer from "@/components/post-container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function TopPosts() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const pageFromUrl = Number(searchParams.get("page") ?? 1);
  const [page, setPage] = React.useState(pageFromUrl);

  const syncUrl = (newPage: number) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (newPage <= 1) sp.delete("page");
    else sp.set("page", String(newPage));

    router.replace(`${pathname}${sp.toString() ? `?${sp}` : ""}`, {
      locale,
      scroll: false,
    });
  };

  const prefetchPage = (p: number) => {
    if (p < 1) return;
    queryClient.prefetchQuery({
      queryKey: ["posts", p],
      queryFn: async () => (await api.get(`/posts?page=${p}`)).data,
      staleTime: 10_000,
    });
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["posts", page],
    queryFn: async () =>
      (await api.get(`/posts?page=${page}`)).data as LaravelPage<Post>,
    placeholderData: (prev) => prev,
  });

  const changePage = (p: number) => {
    setPage(p);
    syncUrl(p);
  };

  const totalPages = data?.last_page ?? 1;

  if (data?.data.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {locale === "ar" ? "أحدث المقالات" : "Latest Posts"}
        </h2>

        <div className="mt-4 flex items-center justify-center gap-1">
          <Button
            variant={"ghost"}
            size={"sm"}
            disabled={page <= 1 || isFetching}
            onClick={() => changePage(page - 1)}
            onMouseEnter={() => prefetchPage(page - 1)}
          >
            {locale === "ar" ? "السابق" : "Prev"}
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(
              Math.max(0, page - 3),
              Math.min(totalPages, Math.max(0, page - 3) + 5)
            )
            .map((p) => (
              <Button
                key={p}
                variant={"outline"}
                size={"sm"}
                onClick={() => changePage(p)}
                onMouseEnter={() => prefetchPage(p)}
                disabled={isFetching && p === page}
              >
                <span
                  className={cn(
                    p === page ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {p}
                </span>
              </Button>
            ))}

          <Button
            variant={"ghost"}
            size={"sm"}
            disabled={page >= totalPages || isFetching}
            onClick={() => changePage(page + 1)}
            onMouseEnter={() => prefetchPage(page + 1)}
          >
            {locale === "ar" ? "التالي" : "Next"}
          </Button>
        </div>

        <Link
          href={`/posts`}
          className="text-sm text-muted-foreground hover:underline flex items-center gap-1.5"
        >
          <span>{locale === "ar" ? "عرض الكل" : "View all"}</span>
          {locale === "ar" ? (
            <MoveLeft className="w-4 h-4" />
          ) : (
            <MoveRight className="w-4 h-4" />
          )}
        </Link>
      </div>

      {isLoading ? (
        <div className="py-6 text-muted-foreground">
          {locale === "ar" ? "جارِ التحميل..." : "Loading..."}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.data.map((post) => (
            <PostContainer key={post.id} post={post} />
          ))}
        </div>
      )}
      {isFetching && !isLoading && (
        <div className="text-center text-xs text-muted-foreground mt-2">
          {locale === "ar" ? "يتم تحميل الصفحة..." : "Loading page..."}
        </div>
      )}
    </div>
  );
}
