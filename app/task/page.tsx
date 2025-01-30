import { createClient } from "@/utils/supabase/client";
import { Task, columns } from "./columns";
import { DataTable } from "./data-table";
import ToDoFormClient from "@/components/tasks/task-form";

async function getData(): Promise<Task[]> {
  const supabase = createClient();

  // Fetch tasks
  const { data, error } = await supabase
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
    .order("id", { ascending: false });

  if (error) {
    console.error("Error fetching data:", error.message);
    return [];
  }

  return data;
}

export default async function ToDo() {
  const data = await getData();

  const supabase = createClient();

  const {
    data: { user },
  } = await createClient().auth.getUser();

  // Fetch categories
  const { data: categories } = await supabase
    .from("category")
    .select("id, name");

  // Fetch users
  const { data: users } = await supabase.from("users").select("id, full_name");

  return (
    <>
      <div className="container mx-auto h-screen">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold py-5">รายการงานทั้งหมด</h1>
          {/* <!-- Modal toggle --> */}
          <button
            data-modal-target="crud-modal"
            data-modal-toggle="crud-modal"
            className="bg-blue-700 text-white px-3 py-2 rounded-lg font-light"
            type="button"
          >
            เพิ่มงานใหม่
          </button>
        </div>
        <DataTable columns={columns} data={data} />
      </div>

      {/* <!-- Main modal --> */}
      <div
        id="crud-modal"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          {/* <!-- Modal content --> */}
          <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            {/* <!-- Modal header --> */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Task Management Form
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="crud-modal"
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
            {/* <!-- Modal body --> */}
            <div className="p-4 md:p-7">
              <ToDoFormClient
                users={users || []}
                categories={categories || []}
                userId={user?.id || ""}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
