import { IssueStatusBadge } from "@/app/components";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Table } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import NextLink from "next/link";
import { Issue, Status, Priority } from "@prisma/client"; // Import Priority

export interface IssueQuery {
  status: Status;
  orderBy: keyof Issue;
  page: string;
}

interface Props {
  searchParams: IssueQuery;
  issues: Issue[];
}

const IssueTable = ({ searchParams, issues }: Props) => {
  // Function to determine the CSS class based on priority
  const getPriorityClass = (priority: Priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-400 text-slate-900 text-[11px]  px-1 py-[1px] rounded-sm normal-case"; // Red background, white text for high priority
      case "MEDIUM":
        return "bg-orange-300 text-slate-900 text-[11px]  px-1 py-[1px] rounded-sm normal-case"; // Orange background, white text for medium priority
      case "LOW":
        return "bg-yellow-200 text-slate-900 text-[11px]  px-1 py-[1px] rounded-sm normal-case"; // Yellow background, black text for low priority
      default:
        return ""; // Default styles (no additional styles if needed)
    }
  };

  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          {columns.map((column) => (
            <Table.ColumnHeaderCell
              key={column.value}
              className={column.className}
            >
              <NextLink
                href={{
                  query: {
                    ...searchParams,
                    orderBy: column.value,
                  },
                }}
              >
                {column.label}
              </NextLink>
              {column.value === searchParams.orderBy && (
                <ArrowUpIcon className="inline" />
              )}
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {issues.map((issue) => (
          <Table.Row key={issue.id}>
            {/* Issue Title and Link */}
            <Table.Cell>
              <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
              <div className="block md:hidden">
                <IssueStatusBadge status={issue.status} />
              </div>
            </Table.Cell>

            {/* Status Badge */}
            <Table.Cell className="hidden md:table-cell">
              <IssueStatusBadge status={issue.status} />
            </Table.Cell>

            {/* Priority with conditional styling */}
            <Table.Cell className="hidden md:table-cell">
              <span className={`${getPriorityClass(issue.priority)}`}>
                {issue.priority}
              </span>
            </Table.Cell>

            {/* Due Date */}
            <Table.Cell className="hidden md:table-cell">
              {issue.dueDate
                ? new Date(issue.dueDate).toDateString()
                : "No due date"}
            </Table.Cell>

            {/* Created Date */}
            <Table.Cell className="hidden md:table-cell">
              {new Date(issue.createdAt).toDateString()}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

// Updated columns array to include Priority and Due Date
const columns: {
  label: string;
  value: keyof Issue;
  className?: string;
}[] = [
  { label: "Issue", value: "title" },
  {
    label: "Status",
    value: "status",
    className: "hidden md:table-cell",
  },
  {
    label: "Priority",
    value: "priority",
    className: "hidden md:table-cell", // Show in medium+ screens
  },
  {
    label: "Due Date",
    value: "dueDate",
    className: "hidden md:table-cell", // Show in medium+ screens
  },
  {
    label: "Created",
    value: "createdAt",
    className: "hidden md:table-cell",
  },
];

export const columnNames = columns.map((column) => column.value);

export default IssueTable;
