import Navbar from "@/components/navbar";
import TopBar from "@/components/top-bar";
import React from "react";
import AnnounceWidget from "./widgets/announce-widget";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full flex flex-col bg-accent">
      <TopBar />
      <Navbar />
      <div className="flex-1 container mx-auto max-w-7xl lg:max-w-6xl bg-background border shadow">
        <AnnounceWidget />
        {children}
      </div>
    </div>
  );
};

export default Layout;
