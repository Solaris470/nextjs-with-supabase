import BarChart from "@/components/dashboard/barChart";
import LineChart from "@/components/dashboard/lineChart";
import PieChart from "@/components/dashboard/pieChart";

export default function DashBoard() {
  return (
    <main>
      <h1 className="text-3xl font-bold p-2">Dashboard</h1>
      <div className="flex justify-between gap-3 mb-3 ">
        <div className=" p-2 w-full flex justify-center items-center bg-white rounded-lg">
          <PieChart />
        </div>
        <div className=" p-2 w-full flex justify-center items-center bg-white rounded-lg">
          <BarChart />
        </div>
      </div>
      <div className="p-2 w-full flex justify-center items-center bg-white rounded-lg">
          <LineChart />
        </div>
    </main>
  );
}