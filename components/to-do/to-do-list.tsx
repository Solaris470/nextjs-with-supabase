"use client";

import { useState, useEffect } from "react";
import { createClient, fetchDataById } from "@/utils/supabase/client";
import moment from "moment";

export default function ToDoList() {
  const supabase = createClient();
  const [toDo, setTodo] = useState<any>([]);
  const [searchToDo, setSearchToDo] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);

  const fetchToDo = async () => {
    let { data: to_do, error } = await supabase
      .from("to_do")
      .select(
        `
      id,
      to_do_name,
      assigned_by:to_do_assigned_by_fkey(id, full_name), 
      assigned_to:to_do_assigned_to_fkey(id, full_name), 
      due_date,
      completed_at,
      status
    `
      )
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      to_do?.forEach((todo) => {
        // Check if due_date exists before applying moment
        if (todo.due_date) {
          todo.due_date = moment(todo.due_date).format("DD/MM/YYYY"); // Change format to the desired one
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
    try{
      const data = await fetchDataById(id);
      data.due_date = moment(data.due_date).format("DD/MM/YYYY"); 
      data.end_date = moment(data.end_date).format("DD/MM/YYYY"); 
      setModalData(data);
      setIsModalOpen(true);
    }catch(e){
      console.log(e);
    }
  }

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
            <tr 
              key={to_do.id}
              onClick={() => handleOpenModal(to_do.id)} // เพิ่ม onClick
              className="cursor-pointer" // เพิ่ม cursor pointer เพื่อให้ดูคลิกได้
            >
              <td className="px-4 py-2 border">{i++}</td>
              <td className="px-4 py-2 border">{to_do.to_do_name}</td>
              <td className="px-4 py-2 border">
                {to_do.assigned_by ? to_do.assigned_by.full_name : ""}
              </td>
              <td className="px-4 py-2 border">
                {to_do.assigned_to ? to_do.assigned_to.full_name : ""}
              </td>
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

      {isModalOpen && modalData && (
        <div
        data-modal-backdrop="static"
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center w-full h-full overflow-y-auto bg-black/50"
      >
        <div className="relative w-full max-w-4xl p-4">
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                รายละเอียดงาน
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                }}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="static-modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* Modal body */}
            <form className="p-4 md:p-5">
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    ชื่องาน :
                  </label>
                  <p>{modalData.to_do_name}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="price"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    วันที่เริ่มต้น :
                  </label>
                  <p>{modalData.due_date}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="category"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    วันที่สิ้นสุด :
                  </label>
                  <p>{modalData.end_date}</p>
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    รายละเอียดงาน :
                  </label>
                  <p>
                    <p>{modalData.description}</p>
                  </p>
                </div>
              </div>
            </form>
            {/* Modal footer */}
            <div className="flex items-center gap-2 justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                data-modal-hide="static-modal"
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                แก้ไขงาน
              </button>
              <button
                data-modal-hide="static-modal"
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                รับงานนี้
              </button>
            </div>
          </div>
        </div>
      </div>
      
      )}
    </>
  );
}
