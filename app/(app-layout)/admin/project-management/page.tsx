"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button, Table } from "flowbite-react";
import { Modal } from "flowbite-react";

type Project = {
  id: number;
  name: string;
  created_at: string;
  status: string;
};

export default function ProjectManagement() {
  const supabase = createClient();
  const [projects, setProjects] = useState<Project[]>([]);
  const [editProjectName, setEditProjectName] = useState("");
  const [status, setStatus] = useState("active");
  const [editProjectId, setEditProjectId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("project")
      .select("id, name, created_at, status")
      .order("id", { ascending: true });
    if (error) console.error("Fetch Error:", error);
    else setProjects(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    const { error } = await supabase.from("project").delete().eq("id", id);
    if (error) console.error("Delete Error:", error);
    else fetchProjects();
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewMoreModalOpen, setIsViewMoreModalOpen] = useState(false);

  const handleEdit = (id: any) => {
    const project = projects.find((proj) => proj.id === id);
    if (project) {
      setEditProjectName(project.name);
      setStatus(project.status); // Set current status
      setEditProjectId(project.id);
      setIsEditModalOpen(true);
    }
  };

  const handleViewMore = (id: any) => {
    setIsViewMoreModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editProjectId === null) return;
  
    // Prevent saving when status is inactive
    // if (status === "inactive") {
    //   alert("Cannot save while the project is inactive.");
    //   return;
    // }
  
    const { error } = await supabase
      .from("project")
      .update({ name: editProjectName, status }) // Ensure status is included
      .eq("id", editProjectId);
  
    if (error) {
      console.error("Update Error:", error);
    } else {
      fetchProjects();
      setIsEditModalOpen(false);
    }
  };
  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Project Management</h1>
      {loading ? (
        <p>Loading Projects...</p>
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
            {projects.map((project) => (
              <Table.Row key={project.id}>
                <Table.Cell>{project.id+1}</Table.Cell>
                <Table.Cell>{project.name}</Table.Cell>
                <Table.Cell>
                  {new Date(project.created_at).toLocaleString()}
                </Table.Cell>
                <Table.Cell>{project.status}</Table.Cell>
                <Table.Cell className="flex justify-center gap-2">
                  <Button
                    id="edit"
                    onClick={() => handleEdit(project.id)}
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
                    onClick={() => handleDelete(project.id)}
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
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
      {/* Edit Modal */}
      <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Modal.Header>Edit Project</Modal.Header>
        <Modal.Body>
          <div className="block text-gray-700 text-sm font-bold space-y-4 mb-2">
            <label htmlFor="projectName">ชื่อโปรเจ็กต์ :</label>
            <input
              type="text"
              id="projectName"
              value={editProjectName}
              className="w-full p-2 border rounded"
            />
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
          <p>Here is more information about this Project...</p>
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
