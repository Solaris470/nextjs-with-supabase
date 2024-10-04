import ToDoForm from "@/components/to-do/to-do-form";

export default function ToDoFormPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Task Management Form
        </h2>
        <ToDoForm />
      </div>
    </div>
  );
}
