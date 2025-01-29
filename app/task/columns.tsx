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
  assigned_by: { id: number; full_name: string };
  assigned_to: { id: number; full_name: string };
  start_date: string;
  end_date: string;
  status: string;
};

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "id",
    header: (props) => {
      return <div>ลำดับ</div>;
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
    accessorKey: "assigned_by",
    header: "มอบหมายโดย",
    cell: ({ row }) => {
      return row.original.assigned_by.full_name;
    },
  },
  {
    accessorKey: "assigned_to",
    header: "ผู้รับผิดชอบ",
    cell: ({ row }) => {
      return row.original.assigned_to?.full_name;
    },
  },
  {
    accessorKey: "start_date",
    header: () => <div className="text-left">วันที่เริ่มต้น</div>,
    cell: ({ row }) => {
      return moment(row.original.start_date).format("DD MMM YYYY");
    },
  },
  {
    accessorKey: "end_date",
    header: () => <div className="text-left">วันที่เริ่มต้น</div>,
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
