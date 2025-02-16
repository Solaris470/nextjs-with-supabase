"use client";

import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { MoreHorizontal } from "lucide-react";

import { useEffect, useState } from "react";
import TaskEditForm from "@/components/tasks/task-edit-form";
import TaskDetails from "@/components/tasks/task-detail";
import { Dropdown, Modal, Button } from "flowbite-react";
import { createClient } from "@/utils/supabase/client";
import { useUserRole } from "@/context/userRoleContext";
import { useRouter } from "next/router";

export type Task = {
  id: string;
  to_do_name: string;
  assigned_by: { id: String; full_name: string };
  assigned_to: { id: String; full_name: string };
  start_date: Date;
  end_date: Date;
  status: string;
};


interface AssignedBy {
  id: string;
  full_name: string;
}

interface AssignedTo {
  id: string;
  full_name: string;
}

interface Category {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
}


export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "id",
    header: (props) => {
      return <div className="text-left font-bold  ">ลำดับ</div>;
    },
    cell: ({ row }) => {
      return <div className="ps-3">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "to_do_name",
    header: () => <div className="text-left font-bold">ชื่องาน</div>,
  },
  {
    id: "assigned_by",
    accessorKey: "assigned_by",
    header: () => <div className="text-left font-bold">ผู้มอบหมายงาน</div>,
    filterFn: (row, id, filterValue: AssignedBy) => {
      const rowValue = row.getValue(id) as AssignedBy;
      return rowValue?.full_name === filterValue?.full_name;
    },
    cell: ({ row }) => {
      return row.original.assigned_by?.full_name;
    },
  },
  {
    accessorKey: "assigned_to",
    header: () => <div className="text-left font-bold">ผู้รับผิดชอบ</div>,
    filterFn: (row, id, filterValue: AssignedTo) => {
      const rowValue = row.getValue(id) as AssignedTo;
      return rowValue?.full_name === filterValue?.full_name;
    },
    cell: ({ row }) => {
      return row.original.assigned_to?.full_name;
    },
  },
  {
    accessorKey: "start_date",
    header: () => <div className="text-left">วันที่เริ่มงาน</div>,
    cell: ({ row }) => {
      return moment(row.original.start_date).format("DD MMM YYYY");
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-left font-bold">สถานะงาน</div>,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span
            className={`w-2.5 h-2.5 rounded-full me-2 ${
              row.original.status === "Pending"
                ? "bg-indigo-500"
                : row.original.status === "In Progress"
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
          ></span>
          {row.original.status}
        </div>
      );
    },
  },
  {
    header: () => <div className="text-left font-bold">Action</div>,
    id: "actions",
    cell: ({ row }) => {
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [isEditMode, setIsEditMode] = useState(false);
      const [userId, setUserId] = useState<string | null>(null);
      const supabase = createClient();
      const taskId = row.original.id;
      const [categories, setCategories] = useState<Category[]>([]);
      const [projects, setProjects] = useState<Project[]>([]);
      const { role } = useUserRole();

      useEffect(() => {
        const fetchUser = async () => {
          const { data, error } = await supabase.auth.getUser();
          if (!error && data?.user) {
            setUserId(data.user.id);
          }
        };
        fetchUser();
      }, []);

      const handleViewDetails = () => {
        setIsEditMode(false);
        setIsModalOpen(true);
      };

      const handleEditTask = async () => {
        try {
          const { data: categoriesData, error: categoriesError } = await supabase
            .from("category")
            .select("id, name");
  
          const { data: projectsData, error: projectsError } = await supabase
            .from("project")
            .select("id, name");
  
          if (categoriesError || projectsError) {
            console.error("Error fetching data:", categoriesError || projectsError);
            return;
          }
  
          setCategories(categoriesData || []);
          setProjects(projectsData || []);
  
          setIsEditMode(true);
          setIsModalOpen(true);
        } catch (error) {
          console.error("Fetch Error:", error);
        }
      };

      const handleDeleteTask = async () => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
          const { error } = await supabase.from("tasks").delete().eq("id", taskId);
          if (error) {
            console.error("Error deleting task:", error);
          } else {
            alert("Task deleted successfully.");
            window.location.reload();
          }
        } catch (error) {
          console.error("Delete Error:", error);
        }
      };
      
      return (
        <>
          <Dropdown label={<MoreHorizontal className="h-4 w-4" />} inline={true}>
            <Dropdown.Item onClick={handleViewDetails}>View Details</Dropdown.Item>
            {role != "employee" && (
              <Dropdown.Item onClick={handleEditTask}>Edit Task</Dropdown.Item>
            )}
            {role === "admin" && (
              <Dropdown.Item onClick={handleDeleteTask} className="text-red-600">
                Delete Task
              </Dropdown.Item>
            )}
          </Dropdown>
          <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <Modal.Header>{isEditMode ? "Edit Task" : "Task Details"}</Modal.Header>
            <Modal.Body>
              {isEditMode ? (
                <TaskEditForm
                  categories={categories || []}
                  projects={projects || []} 
                  taskId={taskId} 
                  onClose={() => setIsModalOpen(false)} 
                />
              ) : (
                <TaskDetails taskId={taskId} userId={userId} onClose={() => setIsModalOpen(false)} />
              )}
            </Modal.Body>
          </Modal>
        </>
      );
    },
  },
];
