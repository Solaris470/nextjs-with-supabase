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
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<string>("");

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
        .order("status", { ascending: true })
        .order("id", { ascending: true });

      // 🔹 ถ้ามี projectId ให้กรอง
      if (projectId && projectId !== "all") {
        query = query.eq("project_id", projectId);
      }

      // 🔹 ถ้ามี statusFilter ให้กรอง
      if (statusFilter) {
        query = query.eq("status", statusFilter);
      }

      // 🔹 ถ้ามี priorityFilter ให้กรอง
      if (priorityFilter) {
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

  const handleStatusUpdate = async () => {
    if (!selectedTask || !newStatus) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("tasks")
        .update({ 
          status: newStatus,
          completed_date: newStatus === "Completed" ? new Date().toISOString() : null 
        })
        .eq("id", selectedTask.id);

      if (error) throw error;

      // อัพเดท state ในแอพ
      setTodo(prevToDo =>
        prevToDo.map(todo =>
          todo.id === selectedTask.id
            ? { ...todo, status: newStatus }
            : todo
        )
      );

      setShowEditModal(false);
      setSelectedTask(null);
      setNewStatus("");
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToDo();
  }, [projectId, statusFilter, priorityFilter]);

  const EditStatusModal = () => (
    <>
      {showEditModal && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                อัพเดทสถานะงาน
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedTask(null);
                  setNewStatus("");
                }}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เลือกสถานะใหม่
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="">เลือกสถานะ</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-4 border-t">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedTask(null);
                  setNewStatus("");
                }}
              >
                ยกเลิก
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleStatusUpdate}
                disabled={loading}
              >
                {loading ? "กำลังอัพเดท..." : "บันทึก"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <section id="FilterBar" className="mb-4 bg-white rounded-lg p-3">
        <div className="flex items-center space-x-4">
          <div>
            <label
              htmlFor="statusFilter"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="statusFilter"
              className="block text-sm font-medium text-gray-700"
            >
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
                  className="relative w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700"
                >
                                  <button
                    id="editStatus"
                    className="absolute top-2 right-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                    onClick={() => {
                      setSelectedTask(todo);
                      setNewStatus(todo.status);
                      setShowEditModal(true);
                    }}
                  >
                    <svg
                      className="w-6 h-6 text-gray-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                      />
                    </svg>
                  </button>
                  <h5 className="mb-4 text-xl font-bold">{todo.to_do_name}</h5>
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
          <EditStatusModal />
        </div>
        
      </section>
      
    </>
  );
}
