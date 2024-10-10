import prisma from "@/prisma/client";
import IssueSummary from "./IssueSummary";
import LatestIssues from "./LatestIssues";
import IssueChart from "./IssueChart";
import ProjectSummary from "./ProjectSummary"; // Import the ProjectSummary component
import { Flex, Grid } from "@radix-ui/themes";
import { Metadata } from "next";
import GreetUser from "./Greeting";
import TeamSmall from "./TeamSmall";

export default async function Home() {
  // Fetch issue counts
  const open = await prisma.issue.count({
    where: { status: "OPEN" },
  });
  const inProgress = await prisma.issue.count({
    where: { status: "IN_PROGRESS" },
  });
  const closed = await prisma.issue.count({
    where: { status: "CLOSED" },
  });

  // Fetch project counts
  const totalProjects = await prisma.project.count();
  const upcomingProjects = await prisma.project.count({
    where: {
      dueDate: {
        gte: new Date(), // Projects due today or in the future
      },
    },
  });
  const pastDueProjects = await prisma.project.count({
    where: {
      dueDate: {
        lt: new Date(), // Projects that are past due
      },
    },
  });

  return (
    <>
      <GreetUser />
      <Grid columns={{ initial: "1", md: "2" }} gap="5">
        <Flex direction="column" gap="5">
          <IssueSummary open={open} inProgress={inProgress} closed={closed} />
          <IssueChart open={open} inProgress={inProgress} closed={closed} />
          <ProjectSummary
            totalProjects={totalProjects}
            upcomingProjects={upcomingProjects}
            pastDueProjects={pastDueProjects}
          />
        </Flex>
        <Flex direction="column" gap="5">
          <LatestIssues />
          <TeamSmall />
        </Flex>
      </Grid>
    </>
  );
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Issue Tracker - Dashboard",
  description: "View a summary of project issues",
};
