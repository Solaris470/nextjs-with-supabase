import ToDoForm from "@/components/tasks/task-form";
import { createClient } from "@/utils/supabase/server";

export default async function ToDoFormPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await createClient().auth.getUser();
  
    // Fetch categories
    const { data: categories } = await supabase.from("category").select("id, name");

    // Fetch users
    const { data: users } = await supabase.from("users").select("id, full_name");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Task Management Form
        </h2>
        <ToDoForm
      users={users || []}
      categories={categories || []}
      userId={user?.id || ""}
    />
      </div>
    </div>
  );
}
