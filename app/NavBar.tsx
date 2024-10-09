"use client";

import { Skeleton } from "@/app/components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { AiFillBug } from "react-icons/ai";
import classnames from "classnames";
import { useSession } from "next-auth/react";
import {
  Avatar,
  Box,
  Container,
  DropdownMenu,
  Flex,
  Text,
} from "@radix-ui/themes";
import {
  CalendarDays,
  ChartBarIcon,
  CircleUser,
  File,
  FilePlus2Icon,
  FilesIcon,
  FolderCheck,
  House,
  SirenIcon,
  TagIcon,
  TagsIcon,
  Users2Icon,
} from "lucide-react";

const NavBar = () => {
  return (
    <nav className="border-b mb-5 px-5 py-3">
      <Container>
        <Flex justify="between">
          <Flex align="center" gap="3">
            <NavLinks />
          </Flex>
        </Flex>
      </Container>
    </nav>
  );
};

const NavLinks = () => {
  const currentPath = usePathname();

  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Issues", href: "/issues/list" },
  ];

  return (
    <aside className=" h-screen bg-gray-900 text-white">
      <nav className="p-4">
        {/* Dashboard */}
        <div className="logo">
          <div className="uppercase text-2xl font-bold my-5">
            Ticket Tracker
          </div>
        </div>
        <div className="mb-2">
          <Link
            href="/"
            className="flex items-center p-2 hover:bg-gray-800 rounded-md"
          >
            <House className="mr-2 text-sky-500 w-5" />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* Tickets */}
        <div className="mb-2">
          <div className="flex items-center p-2 hover:bg-gray-800 rounded-md">
            <TagsIcon className="mr-2 text-sky-500 w-5" />
            <span>Tickets</span>
          </div>
          <ul className="pl-6">
            <li className="mb-1">
              <Link
                href="/issues/list"
                className="flex items-center p-1 hover:bg-gray-800 rounded-md"
              >
                <TagIcon className="mr-2 text-sky-500 w-4" />
                All Tickets
              </Link>
            </li>
            <li className="mb-1 hidden">
              <Link
                href="/tickets/my"
                className="flex items-center p-1 hover:bg-gray-800 rounded-md"
              >
                <TagIcon className="mr-2 text-sky-500 w-4" />
                My Tickets
              </Link>
            </li>
            <li className="mb-1">
              <Link
                href="/issues/list?status=OPEN"
                className="flex items-center p-1 hover:bg-gray-800 rounded-md"
              >
                <TagIcon className="mr-2 text-sky-500 w-4" />
                Open Tickets
              </Link>
            </li>
            <li className="mb-1">
              <Link
                href="/issues/list?status=CLOSED"
                className="flex items-center p-1 hover:bg-gray-800 rounded-md"
              >
                <FolderCheck className="mr-2 text-sky-500 w-4" />
                Closed Tickets
              </Link>
            </li>
            <li className="mb-1 hidden">
              <Link
                href="/tickets/overdue"
                className="flex items-center p-1 hover:bg-gray-800 rounded-md"
              >
                <SirenIcon className="mr-2 text-amber-500 w-4" />
                Overdue Tickets
              </Link>
            </li>
          </ul>
        </div>

        {/* Create Ticket */}
        <div className="mb-2">
          <Link
            href="/issues/new"
            className="flex items-center p-2 hover:bg-gray-800 rounded-md"
          >
            <FilePlus2Icon className="mr-2 text-sky-500 w-5" />
            <span>Create Ticket</span>
          </Link>
        </div>

        {/* Projects */}
        <div className="mb-2">
          <Link
            href="/projects"
            className="flex items-center p-2 hover:bg-gray-800 rounded-md"
          >
            <FilesIcon className="mr-2 text-sky-500 w-5" />
            <span>Projects</span>
          </Link>
        </div>

        {/* Teams */}
        <div className="mb-2">
          <Link
            href="/teams"
            className="flex items-center p-2 hover:bg-gray-800 rounded-md"
          >
            <Users2Icon className="mr-2 text-sky-500 w-5" />
            <span>Teams</span>
          </Link>
        </div>

        {/* Reports */}
        <div className="mb-2">
          <Link
            href="/reports"
            className="flex items-center p-2 hover:bg-gray-800 rounded-md"
          >
            <ChartBarIcon className="mr-2 text-sky-500 w-5" />
            <span>Reports</span>
          </Link>
        </div>
        <div className="mb-2 flex items-center p-2 hover:bg-gray-800 rounded-md">
          <CircleUser className="mr-2 text-sky-500 w-5" />
          <span className="text-white">
            <AuthStatus />
          </span>
        </div>
      </nav>
    </aside>
  );
};

const AuthStatus = () => {
  const { status, data: session } = useSession();

  if (status === "loading") return <Skeleton width="3rem" />;

  if (status === "unauthenticated")
    return (
      <Link className="nav-link" href="/api/auth/signin">
        Login
      </Link>
    );

  return (
    <Box>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Avatar
            src={session!.user!.image!}
            fallback="?"
            size="2"
            radius="full"
            className="cursor-pointer"
            referrerPolicy="no-referrer"
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>
            <Text size="2">{session!.user!.email}</Text>
          </DropdownMenu.Label>
          <DropdownMenu.Item>
            <Link href="/api/auth/signout">Log out</Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Box>
  );
};

export default NavBar;
