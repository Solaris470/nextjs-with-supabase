'use server'

import BarChart from "@/components/dashboard/barChart";
import PieChart from "@/components/dashboard/pieChart";
import TaskTotal from "@/components/dashboard/taskTotal";
import ProgresstionBar from "@/components/dashboard/progresstionBar";
import ProjectSelector from "./ProjectSelector";
import { createClient } from "@/utils/supabase/server";

async function getProjects() {
  const supabase = createClient();
  
  const { data: projects } = await supabase
    .from('project')
    .select('id, name')
    .order('name');

  return projects || [];
}

export default async function DashBoard() {
  const projects = await getProjects();

  return (
    <main>
      <div className="flex justify-between items-center p-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2 items-center">
          <ProjectSelector projects={projects} />
        </div>
      </div>

      <div className="flex justify-center items-center  rounded-lg gap-3 mb-3 h-72">
        <div
          style={{ width: "40%" }}
          className="bg-white p-2 rounded-lg h-full shadow-sm"
        >
          <TaskTotal />
        </div>
        <div className="bg-white w-full p-2 rounded-lg h-full shadow-sm">
          <ProgresstionBar />
        </div>
      </div>
      <div className="flex justify-between gap-3 mb-3 ">
        <div className="w-full bg-white rounded-lg p-2 ">
          <PieChart />
        </div>

        <div className="w-full bg-white rounded-lg p-2 ">
          <BarChart />
        </div>
      </div>
    </main>
  );
}
