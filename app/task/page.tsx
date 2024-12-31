import ToDoList from "@/components/tasks/task-list";
import Link from "next/link";
import { Suspense } from "react";

export default function ToDo() {
  return (
    <div className="overflow-x-auto">
      <ToDoList />
    </div>
  );
}
