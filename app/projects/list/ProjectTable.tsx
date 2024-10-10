"use client";

import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Button, Table } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import { Project } from "@prisma/client"; // Adjust the import based on your project structure

export interface ProjectQuery {
  orderBy: keyof Project;
  page: string;
}

interface Props {
  searchParams: ProjectQuery;
  projects: Project[];
}

const ProjectTable = ({ searchParams, projects }: Props) => {
  return (
    <>
      <div className="text-right">
        <Button>
          <Link href="/projects/new" className="block whitespace-nowrap">
            New Project
          </Link>
        </Button>
      </div>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            {columns.map((column) => (
              <Table.ColumnHeaderCell
                key={column.value}
                className={column.className}
              >
                <Link
                  href={{
                    query: {
                      ...searchParams,
                      orderBy: column.value,
                    },
                  }}
                >
                  {column.label}
                </Link>
                {column.value === searchParams.orderBy && (
                  <ArrowUpIcon className="inline" />
                )}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {projects.map((project) => (
            <Table.Row key={project.id}>
              <Table.Cell>
                <Link href={`/projects/${project.id}`}>{project.title}</Link>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {project.description}
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {project.createdAt.toDateString()}
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {project.dueDate ? project.dueDate.toDateString() : "N/A"}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
};

const columns: {
  label: string;
  value: keyof Project;
  className?: string;
}[] = [
  { label: "Project Title", value: "title" },
  {
    label: "Description",
    value: "description",
    className: "hidden md:table-cell",
  },
  {
    label: "Created",
    value: "createdAt",
    className: "hidden md:table-cell",
  },
  {
    label: "Due Date",
    value: "dueDate",
    className: "hidden md:table-cell",
  },
];

export const columnNames = columns.map((column) => column.value);

export default ProjectTable;
