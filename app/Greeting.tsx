"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/app/components";
import Link from "next/link";

// Helper function to get the current greeting based on the time
const getTimeGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) return "Good Morning";
  if (currentHour < 18) return "Good Afternoon";
  return "Good Evening";
};

// Helper function to format the date as Wednesday, October 9
const getFormattedDate = () => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date().toLocaleDateString(undefined, options);
};

const GreetUser = () => {
  const { status, data: session } = useSession();

  if (status === "loading") return <Skeleton width="3rem" />;

  if (status === "unauthenticated")
    return (
      <Link className="nav-link" href="/api/auth/signin">
        Please login
      </Link>
    );

  const greeting = getTimeGreeting();
  const formattedDate = getFormattedDate();

  return (
    <div className="p-3 text-center max-w-xl bg-white rounded-full mx-auto mb-10">
      <p className="text-gray-500">{formattedDate}</p>
      <h1 className="text-xl font-bold">
        {greeting}, {session?.user?.name || "User"}!
      </h1>
    </div>
  );
};

export default GreetUser;
