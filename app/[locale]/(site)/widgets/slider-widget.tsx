"use client";

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import React, { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { getImageUrl } from "@/lib/helpers";
import { AlertCircle, Loader } from "lucide-react";
import { SliderItem } from "@/lib/types";

const SliderWidget = () => {
  const autoplayPlugin = useRef(
    Autoplay({ delay: 10000, stopOnInteraction: true })
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["sliders"],
    queryFn: async () => {
      const res = await api.get("/sliders");
      return res.data as SliderItem[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden">
        <Loader className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data || data.length === 0) {
    return (
      <div className="flex flex-col gap-2 text-muted-foreground justify-center items-center w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden">
        <AlertCircle className="text-muted-foreground" />
        <p>لا توجد صور للعرض</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto relative">
      <Carousel
        opts={{ loop: true, direction: "rtl" }}
        plugins={[autoplayPlugin.current]}
        className="w-full"
        onMouseEnter={autoplayPlugin.current.stop}
        onMouseLeave={() => autoplayPlugin.current.play()}
      >
        <CarouselContent>
          {data.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden">
                <a
                  href={
                    slide.type === "url"
                      ? slide.url
                      : slide.type === "post"
                      ? `/posts/${slide.post_id}`
                      : "#"
                  }
                  target={slide.type === "url" ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="relative block w-full h-full"
                >
                  <Image
                    src={getImageUrl(slide.image)}
                    alt={`Slide ${slide.id}`}
                    fill
                    className="object-cover w-full h-auto"
                    unoptimized
                    priority
                  />
                </a>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* ✅ Buttons inside slider (overlay) */}
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full shadow-md p-2 hidden sm:flex" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full shadow-md p-2 hidden sm:flex" />
      </Carousel>
    </div>
  );
};

export default SliderWidget;
