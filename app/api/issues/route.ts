import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { issueSchema } from "../../validationSchemas";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate request body using issueSchema
    const validation = issueSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      priority,
      dueDate,
      assignedToUserId,
      projectId,
    } = validation.data;

    // Check if assigned user exists if provided
    if (assignedToUserId) {
      const user = await prisma.user.findUnique({
        where: { id: assignedToUserId },
      });
      if (!user) {
        return NextResponse.json(
          { error: "Invalid assigned user." },
          { status: 400 }
        );
      }
    }

    // Check if the project exists if projectId is provided
    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });
      if (!project) {
        return NextResponse.json(
          { error: "Project not found." },
          { status: 404 }
        );
      }
    }

    // Create the new issue
    const newIssue = await prisma.issue.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null, // Convert dueDate to Date object if provided
        assignedToUserId, // Add assigned user if provided
        projectId, // Link issue to project if provided
      },
    });

    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    console.error("Error creating issue:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
