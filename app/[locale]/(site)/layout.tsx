import Navbar from "@/components/navbar";
import TopBar from "@/components/top-bar";
import AnnounceWidget from "./widgets/announce-widget";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-accent">
      <TopBar />
      <Navbar />
      <AnnounceWidget />
      <main className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-5 bg-background border shadow-lg">
        {children}
      </main>
    </div>
  );
}
