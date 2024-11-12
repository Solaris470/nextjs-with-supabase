"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import moment from "moment";

export default function ToDoList() {
  const supabase = createClient();
  const [toDo, setTodo] = useState<any>([]);
  const [searchToDo, setSearchToDo] = useState([]);

  const fetchToDo = async () => {

    let { data: to_do, error } = await supabase
    .from('to_do')
    .select(`
      id,
      to_do_name,
      assigned_by:to_do_assigned_by_fkey(id, full_name), 
      assigned_to:to_do_assigned_to_fkey(id, full_name), 
      due_date,
      completed_at,
      status
    `)
    .order('id', { ascending: false });
  
    if (error) {
      console.error(error);
    } else {
      to_do?.forEach(todo => {
        // Check if due_date exists before applying moment
        if (todo.due_date) {
          todo.due_date = moment(todo.due_date).format('DD/MM/YYYY'); // Change format to the desired one
        }
      });
      
      setTodo(to_do);
      console.log(to_do);
      
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

  return (
    <>
      <div className="relative w-60 px-3">
        <input
          onChange={handleSearch}
          type="search"
          id="location-search"
          className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
          placeholder="ค้นหาจากชื่องาน"
          required
        />
        <button
          onClick={search}
          className="absolute top-0 end-0 h-full p-2.5 text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          <span className="sr-only">ค้นหางาน</span>
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-200 mt-3">
        <thead>
          <tr>
            <th className="px-4 py-2 border">ลำดับ</th>
            <th className="px-4 py-2 border">ชื่องาน</th>
            <th className="px-4 py-2 border">มอบหมายโดย</th>
            <th className="px-4 py-2 border">ผู้รับผิดชอบ</th>
            <th className="px-4 py-2 border">วันที่เริ่มต้น</th>
            <th className="px-4 py-2 border">วันที่สิ้นสุด</th>
            <th className="px-4 py-2 border">สถานะงาน</th>
          </tr>
        </thead>
        <tbody>
          {toDo.map((to_do: any) => (
            <tr key={to_do.id}>
              <td className="px-4 py-2 border">{i++}</td>
              <td className="px-4 py-2 border">{to_do.to_do_name}</td>
              <td className="px-4 py-2 border">{to_do.assigned_by ? to_do.assigned_by.full_name : ""}</td>
              <td className="px-4 py-2 border">{to_do.assigned_to ? to_do.assigned_to.full_name : ""}</td>
              <td className="px-4 py-2 border">{to_do.due_date}</td>
              <td className="px-4 py-2 border">{to_do.completed_at}</td>
              <td className="px-4 py-2 border">
                <span
                  className={`${
                    to_do.status === "Pending"
                      ? "bg-gray-300 p-2 rounded-xl text-white inline-block"
                      : to_do.status === "In Progress"
                        ? "bg-yellow-300 p-2 rounded-xl text-white inline-block"
                        : "bg-green-300 p-2 rounded-xl text-white inline-block"
                  }
                  `}
                >
                  {to_do.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
