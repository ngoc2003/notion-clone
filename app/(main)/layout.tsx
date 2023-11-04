"use client";

import Spinner from "@/components/spinner";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import MainNavigation from "./_components/navigation";

interface MainLayoutProps {
  children: ReactNode;
}
const MainLayout = ({ children }: MainLayoutProps) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  console.log("Render", Date.now());

  if (isLoading) {
    return (
      <div className="h-full w-full grid place-items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect("/");
  }

  return (
    <div className="h-full flex dark:bg-[#1f1f1f]">
      <MainNavigation />
      <main className="flex-1 h-full overflow-y-auto">{children}</main>
    </div>
  );
};

export default MainLayout;
