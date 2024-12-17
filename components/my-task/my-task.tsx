"use client";

import { useState, useEffect } from "react";
import { createClient, fetchDataById } from "@/utils/supabase/client";
import moment from "moment";

export default function MyTaskList() {
  const supabase = createClient();
  const [toDo, setTodo] = useState<any>([]);
  const [searchToDo, setSearchToDo] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);

  const fetchToDo = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id;

    let { data: to_do, error } = await supabase
      .from("tasks")
      .select(
        `
        id,
      to_do_name,
      description,
      status,
      priority,
      assigned_by:to_do_assigned_by_fkey(id, full_name), 
      assigned_to:to_do_assigned_to_fkey(id, full_name), 
      start_date,
      end_date,
      completed_date
    `
      )
      .eq("assigned_to", userId)
      .order("id", { ascending: false });

    if (error) {
      console.error(error.message);
    } else {
      to_do?.forEach((todo) => {
        // Check if start_date exists before applying moment
        if (todo.start_date) {
          todo.start_date = moment(todo.start_date).format("DD/MM/YYYY"); // Change format to the desired one
          todo.end_date = moment(todo.end_date).format("DD/MM/YYYY"); // Change format to the desired one
        }
      });
      setTodo(to_do);
    }
  };

  const handleSearch = (e: any) => {
    setSearchToDo(e.target.value);
  };

  const search = async () => {
    let { data, error } = await supabase
      .from("to_do")
      .select("*")
      .like("to_do_name", `%${searchToDo}%`);

    if (error) {
      alert(error);
    } else {
      setTodo(data);
    }
  };

  useEffect(() => {
    fetchToDo();
  }, []);
  let i = 1;

  const handleOpenModal = async (id: string) => {
    try {
      const data = await fetchDataById(id);
      data.start_date = moment(data.start_date).format("DD/MM/YYYY");
      data.end_date = moment(data.end_date).format("DD/MM/YYYY");
      setModalData(data);
      setIsModalOpen(true);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold ">My Task List</h1>
      <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
            {toDo.map((to_do: any) => (
              <div
                key={to_do.id}
                className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700"
              >
                <h5 className="mb-4 text-xl font-medium ">
                  {to_do.to_do_name}
                </h5>
                <hr />
                <ul className="max-w-md space-y-1 text-gray-800 list-disc list-inside dark:text-gray-400 leading-loose">
                  {to_do.description && (
                    <div>
                      <h5 className="font-bold text-black">รายละเอียดงาน</h5>
                      <li>{to_do.description}</li>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <div className="">
                      <h5 className="font-bold text-black">สถานะ</h5>
                      <li
                        className={`
                    ${
                      to_do.status == "Pending"
                        ? "bg-indigo-100 text-indigo-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-indigo-400 border border-indigo-400 inline-block"
                        : to_do.status == "In Progress"
                          ? "bg-yellow-100 text-yellow-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-400 border border-yellow-400 inline-block"
                          : "bg-green-100 text-green-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 inline-block"
                    }`}
                      >
                        {to_do.status}
                      </li>
                    </div>
                    <div className="">
                      <h5 className="font-bold text-black">ความยาก</h5>
                      <li
                        className={`
                  ${
                    to_do.priority == "Low"
                      ? "bg-green-100 text-green-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 inline-block"
                      : to_do.priority == "Medium"
                        ? "bg-yellow-100 text-yellow-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-400 border border-yellow-400 inline-block"
                        : "bg-red-100 text-red-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400 inline-block"
                  }
                  `}
                      >
                        {to_do.priority}
                      </li>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="font-bold text-black">วันที่เริ่มต้น</h5>
                      <p>{to_do.start_date}</p>
                    </div>
                    <div>
                      <h5 className="font-bold text-black">วันที่สิ้นสุด</h5>
                      <p>{to_do.end_date}</p>
                    </div>
                  </div>

                  <h5 className="font-bold text-black">ผู้มอบหมายงาน</h5>
                  <li>{to_do.assigned_by.full_name}</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
