import { z } from "zod";

export const issueSchema = z.object({
  title: z.string().min(1, "Title is required.").max(255),
  description: z.string().min(1, "Description is required.").max(65535),
});

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
});

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().optional(),
  createdBy: z.string().min(1, "Created By is required"),
});

export const patchProjectSchema = z.object({
  title: z.string().min(1).max(255).optional(), // Title is a required string with a max length
  description: z.string().optional(), // Description is optional
  dueDate: z
    .string()
    .optional()
    .refine(
      (date) => {
        // Validate if the date is in a valid format (ISO 8601)
        return !isNaN(Date.parse(date));
      },
      {
        message: "Invalid date format", // Custom error message for invalid date
      }
    ),
  createdBy: z.string().optional(), // Created by is optional
});
