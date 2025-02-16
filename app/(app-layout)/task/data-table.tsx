"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Search } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AssignedBy {
  id: string;
  full_name: string;
}

interface AssignedTo {
  id: string;
  full_name: string;
}

interface Task {
  id: string;
  to_do_name: string;
  status: string;
  assigned_by: AssignedBy;
  assigned_to?: AssignedTo; // อาจเป็น undefined ได้
  start_date?: string;
  end_date?: string;
}

interface DataTableProps {
  columns: ColumnDef<Task, any>[];
  data: Task[];
}

export function DataTable({
  columns,
  data,
}: DataTableProps) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <section className="">
      <div id="FilterBar" className="bg-white p-5 rounded-md mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
        <Input
          placeholder="ค้นหาจากชื่องาน..."
          value={(table.getColumn("to_do_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("to_do_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Select
            value={
              (table.getColumn("status")?.getFilterValue() as string) ?? ""
            }
            onValueChange={(value) =>
              table.getColumn("status")?.setFilterValue(value)
            }
          >
            <SelectTrigger className="max-w-sm">
              <SelectValue placeholder="เลือกสถานะ..." />
            </SelectTrigger>
            <SelectContent className="bg-white cursor-pointer">
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={
              (table.getColumn("assigned_by")?.getFilterValue() as string) ?? ""
            }
            onValueChange={(value) => {
              const selectedPerson = data.find((item) => item.assigned_by.full_name === value )?.assigned_by;
              table.getColumn("assigned_by")?.setFilterValue(selectedPerson);
            }}
          >
            <SelectTrigger className="max-w-sm">
              <SelectValue placeholder="เลือกผู้มอบหมายงาน..." />
            </SelectTrigger>
            <SelectContent>
              {Array.from(
                new Set(data.map((item) => JSON.stringify(item.assigned_by)))
              )
                .map((str) => JSON.parse(str))
                .filter(Boolean)
                .map((assignedBy: AssignedBy) => (
                  <SelectItem className="bg-white cursor-pointer" key={assignedBy.id} value={assignedBy.full_name}>
                    {assignedBy.full_name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Select
            value={
              (table.getColumn("assigned_to")?.getFilterValue() as string) ?? ""
            }
            onValueChange={(value) => {
              const selectedPerson = data.find((item) => item.assigned_to?.full_name === value )?.assigned_to;
              table.getColumn("assigned_to")?.setFilterValue(selectedPerson);
            }}
          >
            <SelectTrigger className="max-w-sm">
              <SelectValue placeholder="เลือกผู้รับผิดชอบ..." />
            </SelectTrigger>
            <SelectContent>
              {Array.from(
                new Set(data.map((item) => JSON.stringify(item.assigned_to)))
              )
                .map((str) => JSON.parse(str))
                .filter(Boolean)
                .map((assignedTo: AssignedTo) => (
                  <SelectItem className="bg-white cursor-pointer" key={assignedTo.id} value={assignedTo.full_name}>
                    {assignedTo.full_name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {/* <div className={cn("grid gap-2")}>
            <Popover>
              <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                "w-[300px] justify-start text-left font-normal",
                !table.getColumn("start_date")?.getFilterValue() && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {table.getColumn("start_date")?.getFilterValue() ? (
                `${format(table.getColumn("start_date")?.getFilterValue() as Date, "PP")} - ${
                  table.getColumn("end_date")?.getFilterValue()
                  ? format(table.getColumn("end_date")?.getFilterValue() as Date, "PP")
                  : format(table.getColumn("start_date")?.getFilterValue() as Date, "PP")
                }`
                ) : (
                <span>เลือกช่วงวันที่</span>
                )}
              </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={table.getColumn("start_date")?.getFilterValue() as Date || new Date()}
                selected={{
                from: table.getColumn("start_date")?.getFilterValue() as Date,
                to: table.getColumn("end_date")?.getFilterValue() as Date
                }}
                onSelect={(range) => {
                table.getColumn("start_date")?.setFilterValue(range?.from);
                table.getColumn("end_date")?.setFilterValue(range?.to);
                }}
                numberOfMonths={2}
              />
              </PopoverContent>
            </Popover>
            </div> */}
            
          <Button
            variant="outline"
            onClick={() => {
              table.getColumn("to_do_name")?.setFilterValue("");
              table.getColumn("status")?.setFilterValue("");
              table.getColumn("assigned_by")?.setFilterValue("");
              table.getColumn("assigned_to")?.setFilterValue("");
              table.getColumn("start_date")?.setFilterValue(undefined);
              table.getColumn("end_date")?.setFilterValue(undefined);
            }}
            className="px-4 text-red-500"
          >
            Reset Filter
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
          </Button>
        </div>
        <div className="">

        </div>
      
      </div>
      <div id="TaskData" className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2 py-3">
        <div className="flex-1 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-light">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="bottom" className="bg-white cursor-pointer ">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
