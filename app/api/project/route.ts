import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// GET all projects
export async function GET(request: NextRequest) {
  try {
    const projects = await prisma.project.findMany({
      include: { issues: true }, // Include related issues if needed
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST a new project
export async function POST(request: NextRequest) {
  const { title, description, dueDate, createdBy } = await request.json();

  try {
    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        dueDate,
        createdBy,
      },
    });
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

// PUT to update a project by id
export async function PUT(request: NextRequest) {
  const { id, title, description, dueDate, createdBy } = await request.json();

  try {
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        dueDate,
        createdBy,
      },
    });
    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE a project by id
export async function DELETE(request: NextRequest) {
  const { id } = await request.json();

  try {
    await prisma.project.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
