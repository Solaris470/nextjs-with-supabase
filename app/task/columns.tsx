"use client";

import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    accessorKey: "end_date",
    header: () => <div className="text-left">วันที่สิ้นสุดงาน</div>,
    cell: ({ row }) => {
      return moment(row.original.end_date).format("DD MMM YYYY");
    },
  },
  {
    accessorKey: "status",
    header: "สถานะงาน",
    cell: ({ row }) => {
      return (
        <div
          className={`${
            row.original.status === "Pending"
              ? "bg-indigo-100 text-indigo-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-indigo-400 border border-indigo-400"
              : row.original.status === "In Progress"
                ? "bg-yellow-100 text-yellow-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-400 border border-yellow-400"
                : "bg-green-100 text-green-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400"
          }`}
        >
          {row.original.status}
        </div>
      );
    },
  },
  {
    header: () => <div className="text-left font-bold">Action</div>,
    id: "actions",
    cell: ({ row }) => {
      const taskId = row.original.id;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white cursor-pointer">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-sky-500">ดูรายละเอียดงาน</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-sky-500">แก้ไขงาน</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
