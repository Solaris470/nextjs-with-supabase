"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface Category {
  id: string;
  name: string;
}

export default function ToDoFormContactClient({
  users,
  categories,
  userId,
}: {
  users: any;
  categories: Category[];
  userId: string;
}) {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("");
  const [assignedByUser, setAssignedByUser] = useState<any>(null);
  const [assignedToUser, setAssignedToUser] = useState<any>(null);

  const router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();
  const cardId = searchParams.get("id") ?? ""; // กำหนดค่าเริ่มต้นหากเป็น null

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
    const { error } = await supabase.from("tasks").insert([
      {
        to_do_name: taskName,
        description: description,
        status: status,
        priority: priority,
        start_date: dueDate,
        end_date: endDate,
        assigned_by: userId,
        assigned_to: cardId || null, // ป้องกันปัญหา `null` type error
        category_id: category,
      },
    ]);

    if (error) {
      console.error("Error saving task:", error.message);
      alert("Error saving task. Please try again.");
    } else {
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
      
      <div className="grid gap-4 grid-cols-2">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueDate">
            วันที่เริ่มต้น :
          </label>
          <input
            id="dueDate"
            type="date"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
            วันที่สิ้นสุด :
          </label>
          <input
            id="endDate"
            type="date"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      

      <div className="flex items-center justify-center">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
          เพิ่มงาน
        </button>
      </div>
    </form>
  );
}
