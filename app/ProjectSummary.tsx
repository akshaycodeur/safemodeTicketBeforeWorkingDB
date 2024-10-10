import prisma from "@/prisma/client";
import { Avatar, Card, Flex, Heading, Table } from "@radix-ui/themes";
import React from "react";
import Link from "next/link";

const LatestProjects = async () => {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    // You can include related data here if needed
    // include: { issues: true }, // Uncomment if you want to include related issues
  });

  return (
    <Card>
      <Heading size="4" mb="5">
        Latest Projects
      </Heading>
      <Table.Root>
        <Table.Body>
          {projects.map((project) => (
            <Table.Row key={project.id}>
              <Table.Cell>
                <Flex justify="between">
                  <Flex direction="column" align="start" gap="2">
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-sm font-semibold hover:underline text-sky-400 hover:text-sky-600"
                    >
                      <p className="text-bold">{project.title}</p>
                    </Link>
                    <p>{project.description}</p>
                  </Flex>
                  {/* If you have an assigned user, you can include their avatar here */}
                  {/* Example if using assigned user (you need to modify your model) */}
                  {/* {project.assignedToUser && (
                    <Avatar
                      src={project.assignedToUser.image!}
                      fallback="?"
                      size="2"
                      radius="full"
                    />
                  )} */}
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  );
};

export default LatestProjects;
