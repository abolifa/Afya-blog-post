import SliderWidget from "./widgets/slider-widget";
import TopPosts from "./widgets/top-posts";
import Stats from "@/components/stats";
import Complaints from "@/components/complaints";

export default function Home() {
  return (
    <div className="w-full flex flex-col gap-5 px-5 lg:px-10">
      <SliderWidget />
      <TopPosts />
      <Stats />
      <Complaints />
    </div>
  );
}
