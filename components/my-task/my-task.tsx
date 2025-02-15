"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import moment from "moment";

export default function MyTaskList() {
  const supabase = createClient();
  const [toDo, setTodo] = useState<any[]>([]);
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
        .neq("status", "Completed")
        .order("status", { ascending: true });

      // 🔹 ถ้ามี projectId ให้กรอง
      if (projectId && projectId !== "all") {
        query = query.eq("project_id", projectId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching tasks:", error.message);
        return;
      }

      // 🔹 แปลงวันที่ให้อยู่ในรูปแบบที่ต้องการ
      const formattedData = data.map((todo) => ({
        ...todo,
        start_date: todo.start_date ? moment(todo.start_date).format("DD MMM YYYY") : null,
        end_date: todo.end_date ? moment(todo.end_date).format("DD MMM YYYY") : null,
      }));

      setTodo(formattedData);
    } catch (error) {
      console.error("Unexpected Error:", error);
    }
  };

  useEffect(() => {
    fetchToDo();
  }, [projectId]); // 🔹 เพิ่ม dependency ให้ fetch เมื่อ projectId เปลี่ยน

  return (
    <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mb-6 grid gap-6 sm:grid-cols-2 md:mb-8 lg:grid-cols-4 xl:grid-cols-4">
          {toDo.length > 0 ? (
            toDo.map((todo) => (
              <div
                key={todo.id}
                className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700"
              >
                <h5 className="mb-4 text-xl font-medium">{todo.to_do_name}</h5>
                <hr />
                <ul className="max-w-md space-y-1 text-gray-800 list-disc list-inside dark:text-gray-400 leading-loose">
                  {todo.description && (
                    <div>
                      <h5 className="font-bold text-black">รายละเอียดงาน</h5>
                      <li>{todo.description}</li>
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
  );
}
