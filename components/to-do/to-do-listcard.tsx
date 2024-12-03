"use client";

import { useState, useEffect } from "react";
import { createClient, fetchDataById } from "@/utils/supabase/client";
import moment from "moment";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { getUserRole } from "@/lib/roleUtil";

export default function ToDoList() {
  const supabase = createClient();
  const [role, setRole] = useState(null);
  const [toDo, setTodo] = useState<any>([]);
  const [searchToDo, setSearchToDo] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>([]);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [editData, setEditData] = useState({
    id: null,
    to_do_name: "",
    due_date: "",
    end_date: "",
    description: "",
  });

  async function fetchRole() {
    const userRole = await getUserRole();
    setRole(userRole);
  }

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
      end_date,
      completed_at,
      status
    `
      )
      .order("id", { ascending: false })
      .range(0, 9);

    if (error) {
      console.error(error);
    } else {
      to_do?.forEach((todo) => {
        if (todo.due_date) {
          todo.due_date = moment(todo.due_date).format("DD MMM YYYY");
          todo.end_date = moment(todo.end_date).format("DD MMM YYYY");
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
    fetchRole();
  }, []);
  let i = 1;

  const handleOpenModal = async (id: string) => {
    try {
      const data = await fetchDataById(id);
      data.due_date = moment(data.due_date).format("DD/MMM/YYYY");
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
        .from("to_do")
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
      fetchToDo();
    } catch (e) {
      console.error("Unexpected error:", e);
      alert("เกิดข้อผิดพลาดที่ไม่คาดคิด");
    }
  };

  const handleOpenEditModal = (modalData: any) => {
    setEditData({
      id: modalData.id,
      to_do_name: modalData.to_do_name,
      due_date: moment(modalData.due_date).format("YYYY-MM-DD"),
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
    const { id, to_do_name, due_date, end_date, description } = editData;

    const { error } = await supabase
      .from("to_do")
      .update({ to_do_name, due_date, end_date, description })
      .eq("id", id);

    if (error) {
      console.error("Error updating task:", error);
      alert("เกิดข้อผิดพลาดในการ Update ข้อมูล");
    } else {
      setIsModalOpen(false);
      alert("Update ข้อมูลสำเร็จ");
      fetchToDo();
      setIsModalEditOpen(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold p-3">Work List </h1>

      <div
        id="filter-tab"
        className="bg-white rounded-lg relative w-full px-3 flex items-center justify-between py-2"
      >
        <div className="flex items-center gap-x-4">
          {role == "employee" ? (
            ""
          ) : (
            <div>
            <Link href="/to-do/add">
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                เพิ่มงานใหม่
              </button>
            </Link>
            </div>
          )}
          <form className="w-full max-w-md">
            <div className="relative">
              <input
                type="search"
                id="location-search"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                placeholder="Search for city or address"
                required
              />
              <button
                type="submit"
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
                <span className="sr-only">Search</span>
              </button>
            </div>
          </form>
        </div>

        <div className="flex items-center space-x-2">
          <svg
            onClick={() => setViewMode("card")}
            className={`w-6 h-6 cursor-pointer ${viewMode === "card" ? "text-blue-500" : "text-gray-800"} dark:text-white`}
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
              strokeWidth="2"
              d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"
            />
          </svg>
          <svg
            onClick={() => setViewMode("table")}
            className={`w-6 h-6 cursor-pointer ${viewMode === "table" ? "text-blue-500" : "text-gray-800"} dark:text-white`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeWidth="2"
              d="M3 11h18M3 15h18M8 10.792V19m4-8.208V19m4-8.208V19M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
            />
          </svg>
        </div>
      </div>
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
            {toDo.map((to_do: any) => (
              <tr
                key={to_do.id}
                onClick={() => handleOpenModal(to_do.id)} // เพิ่ม onClick
                className="cursor-pointer text-[#202224] bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" // เพิ่ม cursor pointer เพื่อให้ดูคลิกได้
              >
                <td className="py-3.5 text-center">{i++}</td>
                <td>{to_do.to_do_name}</td>
                <td>{to_do.assigned_by ? to_do.assigned_by.full_name : ""}</td>
                <td>{to_do.assigned_to ? to_do.assigned_to.full_name : ""}</td>
                <td className="text-center">{to_do.due_date}</td>
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
                    <p>{modalData.description}</p>
                  </div>
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
                      htmlFor="due_date"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      วันที่เริ่มต้น :
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      name="due_date"
                      type="date"
                      value={editData.due_date}
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
