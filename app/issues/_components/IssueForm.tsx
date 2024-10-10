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
    defaultValues: {
      priority: issue?.priority || "MEDIUM", // Set default priority
      dueDate: issue?.dueDate ? issue.dueDate.toISOString().split("T")[0] : "", // Set default dueDate
    },
  });
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      if (issue) {
        // PATCH request for updating the issue
        await axios.patch("/api/issues/" + issue.id, data);
      } else {
        // POST request for creating a new issue
        await axios.post("/api/issues", data);
      }
      router.push("/issues/list");
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error); // Log submission error
      setSubmitting(false);
      setError("An unexpected error occurred.");
    }
  });

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
                {...register("priority")} // Register the priority field
                defaultValue={issue?.priority || "MEDIUM"} // Set default priority
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

          {/* Due Date Field */}
          <div className="flex flex-col">
            <label htmlFor="dueDate" className="text-xs">
              Due Date
            </label>
            <TextField.Root>
              <TextField.Input
                type="date"
                {...register("dueDate")} // Register the dueDate field
                defaultValue={issue?.dueDate?.toISOString().split("T")[0]} // Set default dueDate
                className="py-5"
              />
            </TextField.Root>
            <ErrorMessage>{errors.dueDate?.message}</ErrorMessage>
          </div>
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
