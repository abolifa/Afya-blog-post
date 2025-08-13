"use client";

import { api } from "@/lib/api";
import { Post } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader, Calendar } from "lucide-react";
import Link from "next/link";
import { getImageUrl } from "@/lib/helpers";
import { useLocale } from "next-intl";
import PostGallery from "@/components/post-gallery";
import { Separator } from "@/components/ui/separator";

export default function SinglePostPage() {
  const { id } = useParams();
  const locale = useLocale();
  const router = useRouter();

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const res = await api.get(`/posts/${id}`);
      return res.data as Post;
    },
  });

  const { data: relatedPosts } = useQuery({
    queryKey: ["relatedPosts", id],
    queryFn: async () => (await api.get(`/posts/${id}/related`)).data as Post[],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2 text-center">
        <p className="text-muted-foreground">
          {locale === "ar"
            ? "حدث خطأ أثناء تحميل المقال"
            : "Error loading post"}
        </p>
        <button
          onClick={() => router.refresh()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          {locale === "ar" ? "إعادة المحاولة" : "Retry"}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 py-8 flex flex-col gap-10">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        <h1 className="text-2xl sm:text-4xl font-bold leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          {format(new Date(post.created_at), "dd/MM/yyyy")}
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition"
                onClick={() => router.push(`/tags/${tag}`)}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Main Image */}
        <PostGallery
          mainImage={post.main_image}
          images={post.images}
          alt={post.title}
        />
      </motion.header>

      {/* Content */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="prose max-w-none prose-lg prose-neutral dark:prose-invert text-justify leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></motion.section>

      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-semibold">مقالات ذات صلة</h2>
          <Separator />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((rp) => (
              <Card
                key={rp.id}
                className="hover:shadow-md transition-shadow flex flex-col"
              >
                {rp.main_image && (
                  <div className="relative w-full aspect-[5/3]">
                    <Image
                      src={getImageUrl(rp.main_image)}
                      alt={rp.title}
                      fill
                      className="object-cover rounded-t-md"
                      unoptimized
                      priority
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-2 leading-relaxed">
                    {rp.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    href={`/${locale}/posts/${rp.id}`}
                    className="text-primary text-sm hover:underline"
                  >
                    اقرأ المزيد
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
