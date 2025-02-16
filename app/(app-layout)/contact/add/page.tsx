import ToDoFormContactClient from "@/components/contact/task-contactform";
import { createClient } from "@/utils/supabase/server";

export default async function ToDoFormContactPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await createClient().auth.getUser();
  
    // Fetch categories
    const { data: categories } = await supabase.from("category").select("id, name");

    // Fetch users
    const { data: users } = await supabase.from("users").select("id, full_name");

    const { data: projects } = await supabase.from("project").select("id, name");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Task Management Form
        </h2>
        <ToDoFormContactClient
      users={users || []}
      categories={categories || []}
      projects={projects || []}
      userId={user?.id || ""}
    />
      </div>
    </div>
  );
}
