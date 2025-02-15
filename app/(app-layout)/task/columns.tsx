"use client";

import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { MoreHorizontal } from "lucide-react";

import { useEffect, useState } from "react";
import TaskEditForm from "@/components/tasks/task-edit-form";
import TaskDetails from "@/components/tasks/task-detail";
import { Dropdown, Modal, Button } from "flowbite-react";
import { createClient } from "@/utils/supabase/client";


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

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "id",
    header: (props) => {
      return <div className="">ลำดับ</div>;
    },
    cell: ({ row }) => {
      return <div className="ps-3">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "to_do_name",
    header: "ชื่องาน",
  },
  {
    id: "assigned_by",
    accessorKey: "assigned_by",
    header: "ผู้มอบหมายงาน",
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
    header: "ผู้รับผิดชอบ",
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
    header: "สถานะงาน",
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

      const handleEditTask = () => {
        setIsEditMode(true);
        setIsModalOpen(true);
      };

      return (
        <>
          <Dropdown label={<MoreHorizontal className="h-4 w-4" />} inline={true}>
            <Dropdown.Item onClick={handleViewDetails}>View Details</Dropdown.Item>
            <Dropdown.Item onClick={handleEditTask}>Edit Task</Dropdown.Item>
          </Dropdown>
          <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <Modal.Header>{isEditMode ? "Edit Task" : "Task Details"}</Modal.Header>
            <Modal.Body>
              {isEditMode ? (
                <TaskEditForm taskId={taskId} onClose={() => setIsModalOpen(false)} />
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
