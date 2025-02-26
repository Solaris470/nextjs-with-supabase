"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar"
import React from "react";

interface Category {
  id: string;
  name: string;
}

export default function ToDoFormContactClient({
  users,
  categories,
  userId,
  projects,
}: {
  users: any;
  categories: Category[];
  userId: string;
  projects: any;
},
{
  className,
}: React.HTMLAttributes<HTMLDivElement>
) {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("");
  const [project, setProject] = useState<string>("");
  const [assignedByUser, setAssignedByUser] = useState<any>(null);
  const [assignedToUser, setAssignedToUser] = useState<any>(null);

  const router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();
  const cardId = searchParams.get("id") ?? ""; // กำหนดค่าเริ่มต้นหากเป็น null
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  })
  
  useEffect(() => {
    async function fetchUserData(userId: string, setUser: (user: any) => void) {
      if (!userId) return;
      const { data, error } = await supabase
        .from("users")
        .select("id, full_name, role")
        .eq("id", userId)
        .single();
      if (error) {
        console.error(`Error fetching user data for ID ${userId}:`, error.message);
      } else {
        setUser(data);
      }
    }

    fetchUserData(userId, setAssignedByUser);
    if (cardId) fetchUserData(cardId, setAssignedToUser);
  }, [userId, cardId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!taskName || !category || !project) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
  
    const taskData = {
      to_do_name: taskName,
      description: description || null,
      status: status,
      priority: priority,
      start_date: date?.from ? date.from.toISOString() : null,
      end_date: date?.to ? date.to.toISOString() : null,
      assigned_by: userId,
      assigned_to: cardId || null,
      category_id: category,
      project_id: project,
    };
  
    const { data, error } = await supabase.from("tasks").insert([taskData]).select();
  
    if (error) {
      console.error("Error saving task:", error.message);
      alert("เกิดข้อผิดพลาดในการบันทึกงาน: " + error.message);
    } else {
      console.log("Task saved successfully:", data);
      router.push("/task");
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="p-6"> 
      <div className="grid gap-4 grid-cols-2">
        {assignedByUser && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">มอบหมายโดย :</label>
            <label className="block text-gray-700 text-sm font-bold mb-2">{assignedByUser.full_name}</label>
          </div>
        )}

        {assignedToUser && (
          <div className="mb-4 justify-self-end">
            <label className="block text-gray-700 text-sm font-bold mb-2">ผู้รับผิดชอบ :</label>
            <label className="block text-gray-700 text-sm font-bold mb-2">{assignedToUser.full_name}</label>
          </div>
        )}
      </div>

      <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="project"
          >
            เลือกโปรเจกต์ :
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="project"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            required
          >
            <option value="">Select project</option>
            {projects.map((project: any) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

      {/* Form Fields */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
          ประเภทงาน :
        </label>
        <select
          id="category"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select category</option>
          {categories.map((cat: Category) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="task_name">
          ชื่องาน :
        </label>
        <input
          id="task_name"
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter task name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          คำอธิบายของงาน :
        </label>
        <textarea
          id="description"
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={3}
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      
      <div className="grid gap-4 grid-cols-2">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
            สถานะของงาน :
          </label>
          <select
            id="status"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
            ลำดับความสำคัญของงาน :
          </label>
          <select
            id="priority"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>
      
      <div className={cn("grid gap-2 mb-4 text-gray-700", className)}>
        <div>
          <label className="text-sm font-bold" htmlFor="">วันที่เริ่มต้น - วันที่สิ้นสุด :</label>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left text-sm font-bold w-full",
                !date && "text-muted-foreground"
              )}
            >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex items-center justify-center">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
          เพิ่มงาน
        </button>
      </div>
    </form>
  );
}
