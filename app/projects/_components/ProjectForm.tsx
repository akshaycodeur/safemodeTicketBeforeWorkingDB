"use client";

import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { projectSchema } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Project } from "@prisma/client";
import { Button, Callout, TextField } from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import SimpleMDE from "react-simplemde-editor";
import { z } from "zod";
import { useSession } from "next-auth/react"; // Import NextAuth hook for session

// Fetch users for dropdown
const fetchUsers = async () => {
  const response = await axios.get("/api/users");
  if (!response.status === 200) throw new Error("Failed to fetch users");
  return response.data;
};

type ProjectFormData = z.infer<typeof projectSchema>;

const ProjectForm = ({ project }: { project?: Project }) => {
  const router = useRouter();
  const { data: session, status } = useSession(); // Get session data
  const [users, setUsers] = useState([]); // State to store all users
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [createdBy, setCreatedBy] = useState<string | null>(null); // Store selected user

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  // Fetch users and set default createdBy value
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers);
        if (session?.user?.name) {
          setCreatedBy(session.user.name); // Default to logged-in user
        }
      } catch (err) {
        setError("Failed to load users.");
      }
    };

    loadUsers();
  }, [session]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);

      // Logging for debugging
      console.log("Submitting data:", data);

      // Include createdBy in the form data
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("dueDate", data.dueDate || "");
      formData.append("createdBy", createdBy || "Unknown"); // Fallback to "Unknown" if no user

      console.log("FormData entries:", Array.from(formData.entries())); // Logging for debugging

      if (project) {
        await axios.patch("/api/projects/" + project.id, formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Specify content type for FormData
          },
        });
      } else {
        await axios.post("/api/projects", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Specify content type for FormData
          },
        });
      }

      router.push("/projects/list");
      router.refresh();
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitting(false);
      setError("An unexpected error occurred.");
    }
  });

  if (status === "loading") return <Spinner />; // Show loading state while fetching session
  if (!session) return <p>Please log in to create a project.</p>; // Show login prompt if not authenticated

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form className="space-y-3" onSubmit={onSubmit}>
        <TextField.Root>
          <TextField.Input
            defaultValue={project?.title}
            placeholder="Title"
            {...register("title")}
          />
        </TextField.Root>
        <ErrorMessage>{errors.title?.message}</ErrorMessage>

        <Controller
          name="description"
          control={control}
          defaultValue={project?.description}
          render={({ field }) => (
            <SimpleMDE placeholder="Description" {...field} />
          )}
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>

        <TextField.Root>
          <TextField.Input
            type="date"
            defaultValue={project?.dueDate?.toISOString().split("T")[0]}
            placeholder="Due Date"
            {...register("dueDate")}
          />
        </TextField.Root>
        <ErrorMessage>{errors.dueDate?.message}</ErrorMessage>

        <div>
          <label htmlFor="createdBy" className="text-xs">
            Created By
          </label>
          <select
            id="createdBy"
            value={createdBy || ""}
            onChange={(e) => setCreatedBy(e.target.value)}
            className="block w-full p-2 border rounded"
          >
            {users.map((user) => (
              <option key={user.id} value={user.name}>
                {user.name}
              </option>
            ))}
          </select>
          <ErrorMessage>{errors.createdBy?.message}</ErrorMessage>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit New Project"}
        </Button>
      </form>
    </div>
  );
};

export default ProjectForm;
