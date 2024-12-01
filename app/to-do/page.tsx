import ToDoList from "@/components/to-do/to-do-listcard";
import Link from "next/link";
import { Suspense } from "react";

export default function ToDo() {
  return (
    <div className="overflow-x-auto">


      <ToDoList />
    </div>
  );
}
