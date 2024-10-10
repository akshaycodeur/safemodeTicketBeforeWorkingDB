import { z } from "zod";

// Enum for priority values
const priorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);
const statusEnum = z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]);

// Full issue creation schema
export const issueSchema = z.object({
  title: z.string().min(1, "Title is required.").max(255),
  description: z.string().min(1, "Description is required.").max(65535),
  priority: priorityEnum, // Priority is required for new issue creation
  status: statusEnum, // Priority is required for new issue creation
  dueDate: z
    .string()
    .refine(
      (date) => !isNaN(Date.parse(date)), // Ensure it's a valid date
      { message: "Invalid date format" }
    )
    .optional(), // Due date is optional
});

// Partial update schema for patching issues
export const patchIssueSchema = z.object({
  title: z.string().min(1, "Title is required.").max(255).optional(),
  description: z
    .string()
    .min(1, "Description is required.")
    .max(65535)
    .optional(),
  assignedToUserId: z
    .string()
    .min(1, "AssignedToUserId is required.")
    .max(255)
    .optional()
    .nullable(),
  priority: priorityEnum.optional(), // Priority is optional in patch schema
  status: statusEnum.optional(), // Priority is optional in patch schema
  dueDate: z
    .string()
    .optional()
    .refine(
      (date) => !date || !isNaN(Date.parse(date)), // Check if it's a valid date if provided
      { message: "Invalid date format" }
    ),
});

// Project creation schema
export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().optional(),
  createdBy: z.string().min(1, "Created By is required"),
});

// Partial project update schema
export const patchProjectSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  dueDate: z
    .string()
    .optional()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    }),
  createdBy: z.string().optional(),
});
