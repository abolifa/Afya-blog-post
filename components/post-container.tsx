"use client";

import { Post } from "@/lib/types";
import { useLocale } from "next-intl";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";
import { getImageUrl } from "@/lib/helpers";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const PostContainer = ({ post }: { post: Post }) => {
  const locale = useLocale();
  const router = useRouter();

  return (
    <motion.article
      className="cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      onClick={() => router.push(`/${locale}/posts/${post.id}`)}
    >
      <Card className="flex flex-col h-full shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="truncate leading-relaxed">
            {post.title}
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(post.created_at), "dd/MM/yyyy")}</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <motion.div
            className="relative w-full aspect-[5/3] overflow-hidden rounded-md"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Image
              src={getImageUrl(post.main_image ?? "")}
              alt={post.title}
              fill
              className="object-cover rounded-md transition-transform duration-500 group-hover:scale-105"
              priority
              unoptimized
            />
          </motion.div>
        </CardContent>
      </Card>
    </motion.article>
  );
};

export default PostContainer;
