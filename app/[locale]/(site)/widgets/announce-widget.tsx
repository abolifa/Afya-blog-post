"use client";

import { api } from "@/lib/api";
import { Announce } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Zap, ChevronUp, ChevronDown, Pause, Play } from "lucide-react";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "next-intl";
import { BeatLoader } from "react-spinners";

const AnnounceWidget = () => {
  const lang = useLocale();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await api.get("/announcements");
      return res.data as Announce[];
    },
  });

  useEffect(() => {
    if (!data || data.length === 0 || isPaused) return;
    const id = setInterval(() => {
      moveNextAnnouncement();
    }, 6000);
    return () => clearInterval(id);
  }, [data, isPaused, currentIndex]);

  function moveNextAnnouncement() {
    if (!data) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % data.length);
  }

  function movePrevAnnouncement() {
    if (!data) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl bg-background">
        <div className="flex items-center">
          <div className="bg-primary text-primary-foreground flex items-center gap-2 px-4 h-12 whitespace-nowrap">
            <Zap className="w-4 h-4" />
            <span className="font-medium">الإعلانات</span>
          </div>
          <div className="px-3">
            <BeatLoader
              color="#000000"
              size={10}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data || data.length === 0) return null;

  const currentAnnouncement = data[currentIndex];

  const variants = {
    enter: (dir: 1 | -1) => ({
      y: dir === 1 ? 16 : -16,
      opacity: 0,
      position: "absolute" as const,
      width: "100%",
    }),
    center: {
      y: 0,
      opacity: 1,
      position: "absolute" as const,
      width: "100%",
    },
    exit: (dir: 1 | -1) => ({
      y: dir === 1 ? -16 : 16,
      opacity: 0,
      position: "absolute" as const,
      width: "100%",
    }),
  };

  return (
    <div className="container mx-auto max-w-6xl bg-background">
      <div className="flex items-center">
        <div className="bg-primary text-primary-foreground flex items-center gap-2 px-4 h-12 whitespace-nowrap">
          <Zap className="w-4 h-4" />
          <span className="font-medium">الإعلانات</span>
        </div>
        <div className="relative flex-1 h-12 px-3 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={currentAnnouncement.id}
              variants={variants}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="h-12 flex items-center"
            >
              <a
                href={`${lang}/announcements/${currentAnnouncement.id}`}
                className="text-sm hover:text-primary transition-colors truncate w-full"
                title={currentAnnouncement.title}
              >
                {currentAnnouncement.title}
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Controls */}
        <div className="flex items-center divide-x">
          <button
            onClick={movePrevAnnouncement}
            className="w-10 h-12 flex items-center justify-center border text-muted-foreground"
            aria-label="السابق"
          >
            <ChevronUp size={16} />
          </button>
          <button
            onClick={() => setIsPaused((p) => !p)}
            className="w-10 h-12 flex items-center justify-center border text-muted-foreground"
            aria-label={isPaused ? "تشغيل" : "إيقاف"}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button
            onClick={moveNextAnnouncement}
            className="w-10 h-12 flex items-center justify-center border text-muted-foreground"
            aria-label="التالي"
          >
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnounceWidget;
