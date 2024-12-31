"use client";

import { useState, useEffect } from "react";
import { createClient, fetchDataById } from "@/utils/supabase/client";
import moment from "moment";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { getUserRole } from "@/lib/roleUtil";
import FilterBar from "./filterbar";

export default function ToDoList() {
  const supabase = createClient();
  const [role, setRole] = useState(null);
  const [toDo, setTodo] = useState<any>([]);
  const [searchToDo, setSearchToDo] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>([]);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState<any>([]);
  const [itemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState("table");
  const [editData, setEditData] = useState({
    id: null,
    to_do_name: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  async function fetchRole() {
    const userRole = await getUserRole();
    setRole(userRole);
  }

  const fetchToDo = async (page: number, limit: number) => {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let {
      data: to_do,
      count,
      error,
    } = await supabase
      .from("tasks")
      .select(
        `
      id,
      to_do_name,
      assigned_by:to_do_assigned_by_fkey(id, full_name), 
      assigned_to:to_do_assigned_to_fkey(id, full_name), 
      start_date,
      end_date,
      completed_date,
      status
    `,
        { count: "exact" }
      )
      .order("id", { ascending: false })
      .range(start, end);

    if (error) {
      console.error(error);
    } else {
      to_do?.forEach((todo) => {
        if (todo.start_date) {
          todo.start_date = moment(todo.start_date).format("DD MMM YYYY");
          todo.end_date = moment(todo.end_date).format("DD MMM YYYY");
        }
      });

      setTodo(to_do);
      setTotalItems(count);
    }
  };

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // เพิ่ม logic การค้นหา
  };

  useEffect(() => {
    fetchToDo(currentPage, itemsPerPage);
    fetchRole();
  }, [currentPage]);
  let i = 1;
  const handleNextPage = () => setCurrentPage((prev) => prev + 1);
  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleOpenModal = async (id: string) => {
    try {
      const data = await fetchDataById(id);
      data.start_date = moment(data.start_date).format("DD/MMM/YYYY");
      data.end_date = moment(data.end_date).format("DD/MMM/YYYY");
      setModalData(data);
      setIsModalOpen(true);
    } catch (e) {
      console.log(e);
    }
  };

  const handleAcceptTask = async (task_id: any) => {
    try {
      // ดึงข้อมูลผู้ใช้ปัจจุบัน
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      setCurrentUser(user?.id);

      const { data, error } = await supabase
        .from("tasks")
        .update({
          assigned_to: user?.id,
        })
        .eq("id", task_id);

      if (error) {
        console.error("Error updating task:", error.message);
        alert("เกิดข้อผิดพลาดในการกดรับงาน");
        return;
      }

      alert("กดรับงานสำเร็จ");
      setIsModalOpen(false);
      fetchToDo(currentPage, itemsPerPage);
    } catch (e) {
      console.error("Unexpected error:", e);
      alert("เกิดข้อผิดพลาดที่ไม่คาดคิด");
    }
  };

  const handleOpenEditModal = (modalData: any) => {
    setEditData({
      id: modalData.id,
      to_do_name: modalData.to_do_name,
      start_date: moment(modalData.start_date).format("YYYY-MM-DD"),
      end_date: moment(modalData.end_date).format("YYYY-MM-DD"),
      description: modalData.description,
    });
    setIsModalEditOpen(true);
  };

  const handleEditChange = (e: any) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditTask = async (e: any) => {
    e.preventDefault();
    const { id, to_do_name, start_date, end_date, description } = editData;

    const { error } = await supabase
      .from("tasks")
      .update({ to_do_name, start_date, end_date, description })
      .eq("id", id);

    if (error) {
      console.error("Error updating task:", error);
      alert("เกิดข้อผิดพลาดในการ Update ข้อมูล");
    } else {
      setIsModalOpen(false);
      alert("Update ข้อมูลสำเร็จ");
      fetchToDo(currentPage, itemsPerPage);
      setIsModalEditOpen(false);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  return (
    <>
      <div className="p-3 flex justify-between">
        <h1 className="font-bold text-3xl">Work List</h1>
        {role == "employee" ? (
          ""
        ) : (
          <div className="">
            <Link href="/task/add">
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                เพิ่มงานใหม่
              </button>
            </Link>
          </div>
        )}
      </div>
      <FilterBar 
              onSearch={handleSearch}
              viewMode={viewMode}
              setViewMode={setViewMode}
      />
      {viewMode === "card" ? (
        <div>
          {toDo.map((to_do: any) => (
            <a
              key={to_do.id}
              onClick={() => handleOpenModal(to_do.id)}
              className="relative flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-full hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 mb-2"
            >
              <div className="flex flex-col justify-between p-4 leading-normal">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {to_do.to_do_name}
                </h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  ผู้รับผิดชอบ:{" "}
                  {to_do.assigned_to ? to_do.assigned_to.full_name : ""}
                </p>
              </div>
              <div
                className={`absolute top-3 right-2 ${
                  to_do.status === "Pending"
                    ? "bg-indigo-100 text-indigo-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-indigo-400 border border-indigo-400"
                    : to_do.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-400 border border-yellow-400"
                      : "bg-green-100 text-green-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400"
                }`}
              >
                {to_do.status}
              </div>
              <div className="absolute bottom-1 right-2 mr-2">
                <p className="mb-3 font-normal text-xs text-gray-700 dark:text-gray-400">
                  วันที่สิ้นสุด: {to_do.end_date}
                </p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="rounded-lg">
          <table className="w-full bg-white border border-gray-200 mt-3 ">
            <thead className="text-md font-bold  text-[#202224] uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="py-3 col-span-1">ลำดับ</th>
                <th className="col-span-3">ชื่องาน</th>
                <th className="col-span-1">มอบหมายโดย</th>
                <th className="col-span-3">ผู้รับผิดชอบ</th>
                <th className="col-span-3">วันที่เริ่มต้น</th>
                <th className="col-span-3">วันที่สิ้นสุด</th>
                <th className="col-span-1">สถานะงาน</th>
              </tr>
            </thead>
            <tbody className="font-light">
              {toDo.map((to_do: any, index: number) => (
                <tr
                  key={to_do.id}
                  onClick={() => handleOpenModal(to_do.id)} // เพิ่ม onClick
                  className="cursor-pointer text-[#202224] bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" // เพิ่ม cursor pointer เพื่อให้ดูคลิกได้
                >
                  <td className="py-3.5 text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td>{to_do.to_do_name}</td>
                  <td>
                    {to_do.assigned_by ? to_do.assigned_by.full_name : ""}
                  </td>
                  <td>
                    {to_do.assigned_to ? to_do.assigned_to.full_name : ""}
                  </td>
                  <td className="text-center">{to_do.start_date}</td>
                  <td className="text-center">{to_do.end_date}</td>
                  <td className="text-center">
                    <span
                      className={`${
                        to_do.status === "Pending"
                          ? "bg-indigo-100 text-indigo-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-indigo-400 border border-indigo-400 inline-block"
                          : to_do.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-400 border border-yellow-400 inline-block"
                            : "bg-green-100 text-green-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 inline-block"
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
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-600">
              Showing {startItem}-{endItem} of {totalItems}
            </span>
            <div className="flex">
              <button
                onClick={handlePreviousPage}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              <button
                onClick={handleNextPage}
                className="ml-2 px-3 py-1 bg-gray-200 text-gray-700 rounded"
                disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && modalData && (
        <div
          data-modal-backdrop="static"
          aria-hidden="true"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          className="fixed top-0 left-0 right-0 bottom-0 z-40 flex items-center justify-center w-full h-full overflow-y-auto "
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
                <div className="mb-3">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    ชื่องาน :
                  </label>
                  <p>{modalData.to_do_name}</p>
                </div>
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="price"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      สถานะงาน :
                    </label>
                    <p
                      className={`
                    ${
                      modalData.status == "Pending"
                        ? "bg-indigo-100 text-indigo-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-indigo-400 border border-indigo-400 inline-block"
                        : modalData.status == "In Progress"
                          ? "bg-yellow-100 text-yellow-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-400 border border-yellow-400 inline-block"
                          : "bg-green-100 text-green-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 inline-block"
                    }`}
                    >
                      {modalData.status}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="category"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      ความยากงาน :
                    </label>
                    <p
                      className={`
                  ${
                    modalData.priority == "Low"
                      ? "bg-green-100 text-green-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 inline-block"
                      : modalData.priority == "Medium"
                        ? "bg-yellow-100 text-yellow-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-400 border border-yellow-400 inline-block"
                        : "bg-red-100 text-red-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400 inline-block"
                  }
                  `}
                    >
                      {modalData.priority}
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="price"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      วันที่เริ่มต้น :
                    </label>
                    <p>{modalData.start_date}</p>
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
                </div>
                <div className="">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    รายละเอียดงาน :
                  </label>
                  <p>{modalData.description}</p>
                </div>
              </form>
              {/* Modal footer */}
              <div className="flex items-center gap-2 justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                {role == "employee" ? (
                  ""
                ) : (
                  <button
                    onClick={() => handleOpenEditModal(modalData)}
                    data-modal-hide="static-modal"
                    type="button"
                    className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                )}
                {modalData.assigned_to == null ? (
                  <button
                    onClick={() => {
                      handleAcceptTask(modalData.id);
                    }}
                    data-modal-hide="static-modal"
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    รับงานนี้
                  </button>
                ) : (
                  <button
                    type="button"
                    className="text-white bg-blue-400 dark:bg-blue-500 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    disabled
                  >
                    รับงานนี้
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* test */}
      {isModalEditOpen && modalData && (
        <div
          data-modal-backdrop="static"
          aria-hidden="true"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          className="fixed top-0 left-0 right-0 bottom-0 z-40 flex items-center justify-center w-full h-full overflow-y-auto "
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
                    setIsModalEditOpen(false);
                  }}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
                </button>
              </div>
              {/* Modal body */}
              <form onSubmit={handleEditTask} className="p-4 md:p-5">
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      ชื่องาน :
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      name="to_do_name"
                      type="text"
                      value={editData.to_do_name}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="start_date"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      วันที่เริ่มต้น :
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      name="start_date"
                      type="date"
                      value={editData.start_date}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="end_date"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      วันที่สิ้นสุด :
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      name="end_date"
                      type="date"
                      value={editData.end_date}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="description"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      รายละเอียดงาน :
                    </label>
                    <textarea
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      name="description"
                      rows={3}
                      value={editData.description}
                      onChange={handleEditChange}
                      placeholder="Task description"
                    ></textarea>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                  <button
                    type="submit"
                    className="py-2.5 px-5 ms-3 text-sm font-medium text-white bg-green-500 rounded-lg border border-green-500 hover:bg-green-700 focus:ring-4 focus:ring-green-200 dark:focus:ring-green-800 dark:bg-green-700 dark:border-green-600 dark:hover:bg-green-600 dark:hover:text-white"
                  >
                    บันทึก
                  </button>
                  <button
                    onClick={() => {
                      setIsModalEditOpen(false);
                    }}
                    type="button"
                    className="text-gray-900 bg-white border border-gray-200 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
