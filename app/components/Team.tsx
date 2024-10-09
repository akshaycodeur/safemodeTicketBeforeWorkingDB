"use client";

import React, { useEffect, useState } from "react";
import { Skeleton } from "@/app/components";
import Image from "next/image";

// Helper function to fetch all users from an API
const fetchUsers = async () => {
  const response = await fetch("/api/users"); // Replace this with your API endpoint
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
};

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) return <Skeleton width="100%" height="5rem" />;

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-5 text-center">Team List</h1>
      <div className="overflow-hidden rounded-lg shadow-lg bg-white">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left"></th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-2">
                  <Image
                    src={user.image || "/default-avatar.png"}
                    alt={user.name || "User Image"}
                    width={40}
                    height={40}
                    className="rounded-full mx-auto"
                  />
                </td>
                <td className="px-4 py-2">{user.name || "N/A"}</td>
                <td className="px-4 py-2">{user.email || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
