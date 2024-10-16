"use client";

import { Card } from "@radix-ui/themes";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Cell,
} from "recharts";
import React from "react";

interface Props {
  open: number;
  inProgress: number;
  closed: number;
}

const IssueChart = ({ open, inProgress, closed }: Props) => {
  const data = [
    { label: "Open", value: open },
    { label: "In Progress", value: inProgress },
    { label: "Closed", value: closed },
  ];

  const getColor = (label: string) => {
    switch (label) {
      case "Open":
        return "#f87171";
      case "In Progress":
        return "#fbbf24";
      case "Closed":
        return "#34d399";
      default:
        return "var(--accent-9)"; // Fallback color
    }
  };

  return (
    <Card>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="label" />
          <YAxis />
          <Bar dataKey="value" barSize={60}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.label)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default IssueChart;
