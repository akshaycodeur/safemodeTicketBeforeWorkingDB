// ProjectPage.tsx
import Pagination from "@/app/components/Pagination";
import prisma from "@/prisma/client";
import ProjectTable from "./ProjectTable"; // No need to import columnNames here
import { Flex } from "@radix-ui/themes";
import { Metadata } from "next";
import { Project } from "@prisma/client";

export interface ProjectQuery {
  orderBy: keyof Project;
  page: string;
}

const columns = [
  { label: "Project Title", value: "title" },
  {
    label: "Description",
    value: "description",
    className: "hidden md:table-cell",
  },
  { label: "Created", value: "createdAt", className: "hidden md:table-cell" },
  { label: "Due Date", value: "dueDate", className: "hidden md:table-cell" },
];

export const columnNames = columns.map((column) => column.value);

interface Props {
  searchParams: ProjectQuery;
}

const ProjectPage = async ({ searchParams }: Props) => {
  const orderBy = columnNames.includes(searchParams.orderBy)
    ? { [searchParams.orderBy]: "asc" }
    : undefined;

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 10;

  const projects = await prisma.project.findMany({
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const projectCount = await prisma.project.count();

  return (
    <Flex direction="column" gap="3">
      <ProjectTable searchParams={searchParams} projects={projects} />
      <Pagination
        pageSize={pageSize}
        currentPage={page}
        itemCount={projectCount}
      />
    </Flex>
  );
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Project Tracker - Project List",
  description: "View all projects",
};

export default ProjectPage;
