import MyTaskList from "@/components/my-task/my-task";
import { createClient } from "@/utils/supabase/server";

export default async function MyTask() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <MyTaskList />
    </>
  );
}
