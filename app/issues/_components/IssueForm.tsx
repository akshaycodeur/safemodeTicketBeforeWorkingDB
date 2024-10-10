"use client";

import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { issueSchema } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Issue } from "@prisma/client";
import { Button, Callout, TextField } from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import SimpleMDE from "react-simplemde-editor";
import { z } from "zod";

type IssueFormData = z.infer<typeof issueSchema>;

const IssueForm = ({ issue }: { issue?: Issue }) => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
  });
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(true); // Add loading state

  // Fetch available projects and users
  useEffect(() => {
    const fetchProjectsAndUsers = async () => {
      try {
        setLoading(true); // Set loading state when starting the fetch
        const [projectResponse, userResponse] = await Promise.all([
          axios.get("/api/projects"),
          axios.get("/api/users"),
        ]);

        setProjects(projectResponse.data);
        setUsers(userResponse.data);
        setLoading(false); // Set loading state to false when done
      } catch (err) {
        console.error("Error fetching projects or users:", err); // Log error details
        setError("Failed to load projects or users.");
        setLoading(false); // Set loading state to false on error
      }
    };

    fetchProjectsAndUsers();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      if (issue) await axios.patch("/api/issues/" + issue.id, data);
      else await axios.post("/api/issues", data);
      router.push("/issues/list");
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error); // Log submission error
      setSubmitting(false);
      setError("An unexpected error occurred.");
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form className="space-y-3" onSubmit={onSubmit}>
        {/* Title Field */}
        <TextField.Root>
          <TextField.Input
            defaultValue={issue?.title}
            placeholder="Title"
            {...register("title")}
          />
        </TextField.Root>
        <ErrorMessage>{errors.title?.message}</ErrorMessage>

        {/* Description Field */}
        <Controller
          name="description"
          control={control}
          defaultValue={issue?.description}
          render={({ field }) => (
            <SimpleMDE placeholder="Description" {...field} />
          )}
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>

        <div className="flex space-x-5">
          {/* Priority Field */}
          <TextField.Root>
            <div className="flex flex-col">
              <label htmlFor="priority" className="text-xs">
                Priority
              </label>
              <select
                id="priority"
                {...register("priority")}
                defaultValue={issue?.priority || "MEDIUM"}
                className="block w-full p-2 border rounded"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </TextField.Root>
          <ErrorMessage>{errors.priority?.message}</ErrorMessage>

          {/* Status Field */}
          <TextField.Root>
            <div className="flex flex-col">
              <label htmlFor="status" className="text-xs">
                Status
              </label>
              <select
                id="status"
                {...register("status")}
                defaultValue={issue?.status || "OPEN"}
                className="block w-full p-2 border rounded"
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </TextField.Root>
          <ErrorMessage>{errors.status?.message}</ErrorMessage>

          <div className="flex flex-col">
            {/* Due Date Field */}
            <label htmlFor="status" className="text-xs">
              Due Date
            </label>
            <TextField.Root>
              <TextField.Input
                type="date"
                defaultValue={issue?.dueDate?.toISOString().split("T")[0]}
                placeholder="Due Date"
                className="py-5"
                {...register("dueDate")}
              />
            </TextField.Root>
            <ErrorMessage>{errors.dueDate?.message}</ErrorMessage>
          </div>
        </div>

        <div className="hidden">
          {/* Project Field */}
          <TextField.Root>
            <label htmlFor="project" className="text-xs">
              Project
            </label>
            <select
              id="project"
              {...register("projectId")}
              defaultValue={issue?.projectId || ""}
              className="block w-full p-2 border rounded"
            >
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </TextField.Root>
          <ErrorMessage>{errors.projectId?.message}</ErrorMessage>

          {/* Assigned User Field */}
          <TextField.Root>
            <label htmlFor="assignedToUserId" className="text-xs">
              Assigned User
            </label>
            <select
              id="assignedToUserId"
              {...register("assignedToUserId")}
              defaultValue={issue?.assignedToUserId || ""}
              className="block w-full p-2 border rounded"
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
          </TextField.Root>
          <ErrorMessage>{errors.assignedToUserId?.message}</ErrorMessage>
        </div>

        {/* Submit Button */}
        <Button disabled={isSubmitting}>
          {issue ? "Update Issue" : "Submit New Issue"}{" "}
          {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default IssueForm;
