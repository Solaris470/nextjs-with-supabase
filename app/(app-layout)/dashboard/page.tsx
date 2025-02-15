import BarChart from "@/components/dashboard/barChart";
import LineChart from "@/components/dashboard/lineChart";
import PieChart from "@/components/dashboard/pieChart";
import TaskTotal from "@/components/dashboard/taskTotal";
import ProgresstionBar from "@/components/dashboard/progresstionBar";

export default function DashBoard() {
  return (
    <main>
      <h1 className="text-3xl font-bold p-2">Dashboard</h1>
      
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
      <div className="p-2 w-full flex justify-center items-center bg-white rounded-lg">
        {/* <LineChart /> */}
      </div>
    </main>
  );
}
