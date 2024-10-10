"use client";

import React, { useEffect, useState } from "react";
import { Skeleton } from "@/app/components"; // Assuming Skeleton is a pre-existing component in your app
import { Card, Table, Flex, Heading, Avatar } from "@radix-ui/themes"; // Radix components for styling
import Image from "next/image";

// Helper function to fetch all users from an API
const fetchUsers = async () => {
  const response = await fetch("/api/users"); // Replace this with your API endpoint
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
};

const TeamSmall = () => {
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
    <div className="w-full mx-auto">
      <Card>
        <Heading size="4" mb="5" className="text-left">
          Team List
        </Heading>
        <Table.Root>
          <Table.Body>
            {users.map((user) => (
              <Table.Row
                key={user.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <Table.Cell className="p-2 text-center">
                  <Image
                    src={user.image || "/default-avatar.png"}
                    alt={user.name || "User Image"}
                    width={40}
                    height={40}
                    className="rounded-full mx-auto"
                  />
                </Table.Cell>
                <Table.Cell className="px-4 py-2">
                  <p className="font-semibold text-gray-800">
                    {user.name || "N/A"}
                  </p>
                </Table.Cell>
                <Table.Cell className="px-4 py-2">
                  <p className="text-gray-600">{user.email || "N/A"}</p>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>
    </div>
  );
};

export default TeamSmall;
