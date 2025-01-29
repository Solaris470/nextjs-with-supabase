import { createClient } from "@/utils/supabase/client";
import { Task, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Task[]> {
  const supabase = createClient();

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
    .order("id", { ascending: false })

  if (error) {
    console.error("Error fetching data:", error.message);
    return [];
  }

  return data;
}

export default async function ToDo() {
  const data = await getData();

  return (
    <>
      <div className="container mx-auto h-screen">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
}
