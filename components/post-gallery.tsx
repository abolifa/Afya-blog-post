"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { getImageUrl } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // ⬅️ add this

type Props = {
  mainImage?: string | null;
  images?: string[];
  alt?: string;
};

export default function PostGallery({ mainImage, images = [], alt }: Props) {
  const list = React.useMemo(() => {
    const raw = [mainImage, ...(images || [])]
      .filter(Boolean)
      .map((p) => getImageUrl(p as string));
    return Array.from(new Set(raw));
  }, [mainImage, images]);

  const [index, setIndex] = React.useState<number | null>(null);

  if (!list.length) return null;

  const goPrev = () => setIndex((i) => (i! - 1 + list.length) % list.length);
  const goNext = () => setIndex((i) => (i! + 1) % list.length);

  return (
    <>
      {/* Responsive Grid */}
      <div
        className="
          grid gap-3
          grid-cols-1
          sm:grid-cols-3
          auto-rows-[200px]
          sm:auto-rows-[180px]
          lg:auto-rows-[220px]
        "
      >
        {list.map((src, i) => (
          <button
            key={src}
            onClick={() => setIndex(i)}
            className={cn(
              "relative rounded-md overflow-hidden group",
              i === 0 && "sm:col-span-2 sm:row-span-2"
            )}
          >
            <Image
              src={src}
              alt={alt ?? `Gallery image ${i + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized
              priority
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {index !== null && (
          <Dialog open={true} onOpenChange={() => setIndex(null)}>
            <DialogContent
              className="p-0 bg-black rounded-lg w-[96vw] max-w-[96vw] sm:!max-w-[96vw] md:!max-w-[92vw] lg:!max-w-[86vw] xl:!max-w-[80vw] h-[80vh] max-h-[92vh] flex items-center justify-center"
              onEscapeKeyDown={() => setIndex(null)}
            >
              <VisuallyHidden>
                <DialogTitle>{alt ?? `Image ${index! + 1}`}</DialogTitle>
              </VisuallyHidden>

              {/* Close button */}
              <button
                onClick={() => setIndex(null)}
                className="absolute top-3 right-3 z-20 bg-white/80 rounded-full p-1 hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Prev / Next */}
              {list.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 rounded-full p-2 hover:bg-white"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={goNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 rounded-full p-2 hover:bg-white"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image container */}
              <motion.div
                key={list[index!]}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                <Image
                  src={list[index!]}
                  alt={alt ?? `Gallery image ${index! + 1}`}
                  fill
                  className="object-contain"
                  unoptimized
                  priority
                />
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
