"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button, Table } from "flowbite-react";
import { Modal } from "flowbite-react";

type User = {
  id: number;
  full_name: string;
  created_at: string;
  role: string;
};

export default function UserManagement() {
  const supabase = createClient();
  const [users, setUsers] = useState<User[]>([]);
  const [editUserName, setEditUserName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [status, setStatus] = useState("active");
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select("id, full_name, created_at, role")
      .order("id", {ascending: true});
    if (error) console.error("Fetch Error:", error);
    else setUsers(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) console.error("Delete Error:", error);
    else fetchUsers();
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewMoreModalOpen, setIsViewMoreModalOpen] = useState(false);

  const handleEdit = (id: any) => {
    const user = users.find(user => user.id === id);
    if (user) {
      setEditUserName(user.full_name);
      setEditUserId(user.id);
      setIsEditModalOpen(true);
    }
  };

  const handleViewMore = (id: any) => {
    setIsViewMoreModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editUserId === null) return;
  
    const { error } = await supabase
      .from("users")
      .update({ 
        full_name: editUserName, 
        role: editRole,
        status: status
      })
      .eq("id", editUserId);

    if (error) {
      console.error("Update Error:", error);
    } else {
      fetchUsers();
      setIsEditModalOpen(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      {loading ? (
        <p>Loading User...</p>
      ) : (
        <Table hoverable className="bg-white dark:bg-gray-800 rounded-lg">
          <Table.Head>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Created At</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell className="text-center">Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {users.map((user) => (
              <Table.Row key={user.id}>
                <Table.Cell>{user.id}</Table.Cell>
                <Table.Cell>{user.full_name}</Table.Cell>
                <Table.Cell>
                  {new Date(user.created_at).toLocaleString()}
                </Table.Cell>
                <Table.Cell>{user.role}</Table.Cell>
                <Table.Cell className="flex justify-center gap-2">
                  <Button
                    id="edit"
                    onClick={() => handleEdit(user.id)}
                  >
                    <svg
                      className="w-6 h-6 text-yellow-400 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                      />
                    </svg>
                  </Button>
                  <Button
                  id="delete"
                    onClick={() => handleDelete(user.id)}
                  >
                    <svg
                      className="w-6 h-6 text-red-600 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                      />
                    </svg>
                  </Button>
                  <Button
                  id="view"
                    color="info"
                    onClick={() => handleViewMore(user.id)}
                  >
                    <svg
                      className="w-6 h-6 text-blue-400 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeWidth="2"
                        d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                      />
                      <path
                        stroke="currentColor"
                        strokeWidth="2"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
      {/* Edit Modal */}
      <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Modal.Header>Edit User</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <label htmlFor="userName">User Name</label>
            <input
              type="text"
              id="userName"
              value={editUserName}
              onChange={(e) => setEditUserName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="employee">Employee</option>
              <option value="supervisor">Supervisor</option>
            </select>
          </div>
          <div className="block text-gray-700 text-sm font-bold space-y-4 mb-2">
            <label htmlFor="status">สถานะของโปรเจ็กต์ :</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setIsEditModalOpen(false)}>
            Cancel
          </Button>
          <Button color="success" onClick={() => handleSaveEdit()}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* View More Modal */}
      <Modal
        show={isViewMoreModalOpen}
        onClose={() => setIsViewMoreModalOpen(false)}
      >
        <Modal.Header>View More</Modal.Header>
        <Modal.Body>
          <p>Here is more information about this user...</p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setIsViewMoreModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
