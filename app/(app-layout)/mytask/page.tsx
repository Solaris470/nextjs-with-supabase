'use server'

import MyTaskList from "@/components/my-task/my-task";
import { createClient } from "@/utils/supabase/server";
import ProjectSelector from "./ProjectSelector";

async function getProjects() {
  const supabase = createClient();
  
  const { data: projects } = await supabase
    .from('project')
    .select('id, name')
    .order('name');

  return projects || [];
}

export default async function MyTask() {
  const projects = await getProjects();
  

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <div className="flex justify-between items-center p-2">
        <h1 className="text-3xl font-bold">My Task</h1>
        <div className="flex gap-2 items-center">
          <ProjectSelector projects={projects} />
        </div>
      </div>
      <MyTaskList />
    </>
  );
}
