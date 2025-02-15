"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import moment from "moment";

export default function MyTaskList() {
  const supabase = createClient();
  const [toDo, setTodo] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const fetchToDo = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error("Auth Error:", authError.message);
        return;
      }

      if (!user) {
        console.error("No user found");
        return;
      }

      const userId = user.id;

      // 🔹 Query ดึงงาน
      let query = supabase
        .from("tasks")
        .select(
          `id, to_do_name, description, status, priority,
          assigned_by:to_do_assigned_by_fkey(id, full_name), 
          assigned_to:to_do_assigned_to_fkey(id, full_name), 
          start_date, end_date, completed_date`
        )
        .eq("assigned_to", userId)
        .order("status", { ascending: true });

      // 🔹 ถ้ามี projectId ให้กรอง
      if (projectId && projectId !== "all") {
        query = query.eq("project_id", projectId);
      }

      // 🔹 ถ้ามี statusFilter ให้กรอง
      if (statusFilter) {
        query = query.eq("status", statusFilter);
      }

      // 🔹 ถ้ามี priorityFilter ให้กรอง
      if(priorityFilter){
        query = query.eq("priority", priorityFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching tasks:", error.message);
        return;
      }

      // 🔹 แปลงวันที่ให้อยู่ในรูปแบบที่ต้องการ
      const formattedData = data.map((todo) => ({
        ...todo,
        start_date: todo.start_date
          ? moment(todo.start_date).format("DD MMM YYYY")
          : null,
        end_date: todo.end_date
          ? moment(todo.end_date).format("DD MMM YYYY")
          : null,
      }));

      setTodo(formattedData);
    } catch (error) {
      console.error("Unexpected Error:", error);
    }
  };

  useEffect(() => {
    fetchToDo();
  }, [projectId, statusFilter, priorityFilter]);

  return (
    <>
      <section id="FilterBar" className="mb-4 bg-white rounded-lg p-3">
        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">
              สถานะงาน:
            </label>
            <select
              id="statusFilter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">ทั้งหมด</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">
              ความยากงาน:
            </label>
            <select
              id="priorityFilter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">ทั้งหมด</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </section>
      <section id="CardTask" className="bg-white p-2 md:py-12 rounded-lg">
        <div className="mx-auto max-w-screen-xl 2xl:px-0">
          <div className="mb-6 grid gap-6 sm:grid-cols-2 md:mb-8 lg:grid-cols-4 xl:grid-cols-4">
            {toDo.length > 0 ? (
              toDo.map((todo) => (
                <div
                  key={todo.id}
                  className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700"
                >
                  <h5 className="mb-4 text-xl font-medium">
                    {todo.to_do_name}
                  </h5>
                  <hr />
                  <ul className="max-w-md space-y-1 text-gray-800 list-disc list-inside dark:text-gray-400 leading-loose">
                    {todo.description && (
                      <div>
                        <h5 className="font-bold text-black">รายละเอียดงาน</h5>
                        <p>{todo.description}</p>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="font-bold text-black">สถานะ</h5>
                        <li
                          className={`${
                            todo.status === "Pending"
                              ? "bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-indigo-400 border border-indigo-400 inline-block"
                              : todo.status === "In Progress"
                              ? "bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-400 border border-yellow-400 inline-block"
                              : "bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 inline-block"
                          }`}
                        >
                          {todo.status}
                        </li>
                      </div>
                      <div>
                        <h5 className="font-bold text-black">ความยาก</h5>
                        <li
                          className={`${
                            todo.priority === "Low"
                              ? "bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 inline-block"
                              : todo.priority === "Medium"
                              ? "bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-400 border border-yellow-400 inline-block"
                              : "bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400 inline-block"
                          }`}
                        >
                          {todo.priority}
                        </li>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="font-bold text-black">วันที่เริ่มต้น</h5>
                        <p>{todo.start_date || "-"}</p>
                      </div>
                      <div>
                        <h5 className="font-bold text-black">วันที่สิ้นสุด</h5>
                        <p>{todo.end_date || "-"}</p>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-bold text-black">ผู้มอบหมายงาน</h5>
                      <li>{todo.assigned_by.full_name}</li>
                    </div>
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-400">
                ไม่พบข้อมูลงานที่ต้องทำ
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}