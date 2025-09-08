"use client";
import React, { useState } from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/sidebar/sidebar";
import { LayoutDashboard, UserCog, Settings, LogOut, Link } from "lucide-react";
import { cn } from "@/lib/utils";
import StockContainer from "@/components/stock/stock-container";
import { Button } from "@/components/ui/button";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const links = [
    {
      label: "대시보드",
      href: "#",
      icon: (
        <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "포트폴리오",
      href: "#",
      icon: (
        <UserCog className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "설정",
      href: "#",
      icon: (
        <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "로그아웃",
      href: "#",
      icon: (
        <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-[#fff] dark:bg-neutral-800 w-full mx-auto border border-neutral-200 dark:border-neutral-700 ",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 border-r border-neutral-200 dark:border-neutral-700">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "사용자",
                href: "#",
                icon: (
                  <div className="h-7 w-7 flex-shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                    U
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="w-full">{children}</div>
      <div
        className={cn(
          "h-full flex items-center justify-center flex-col",
          stockOpen ? "w-full" : "w-[100px]"
        )}
      >
        <div className={cn("flex justify-start w-full mb-5")}>
          <Button variant="outline" onClick={() => setStockOpen(!stockOpen)}>
            {/* 페이지 좌우 접는 아이콘 */}
            <Settings />
          </Button>
        </div>
        <StockContainer className={`${stockOpen ? "block" : "hidden"}`} />
      </div>
    </div>
  );
}
