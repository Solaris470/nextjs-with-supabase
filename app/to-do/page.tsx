export default function ToDoList() {

    const tasks = [
        // ตัวอย่างข้อมูล
        {
          id: 1,
          task_name: 'Task 1',
          description: 'Description 1',
          status: 'Pending',
          priority: 'High',
          due_date: '2024-09-30',
          created_at: '2024-09-01',
          updated_at: '2024-09-15',
          assigned_by: 'User A',
          assigned_to: 'User B',
          completed_at: null,
          attachments: 'file1.pdf',
        },
        {
          id: 2,
          task_name: 'Task 1',
          description: 'Description 1',
          status: 'Pending',
          priority: 'High',
          due_date: '2024-09-30',
          created_at: '2024-09-01',
          updated_at: '2024-09-15',
          assigned_by: 'User A',
          assigned_to: 'User B',
          completed_at: null,
          attachments: 'file1.pdf',
        },
        {
          id: 3,
          task_name: 'Task 1',
          description: 'Description 1',
          status: 'Pending',
          priority: 'High',
          due_date: '2024-09-30',
          created_at: '2024-09-01',
          updated_at: '2024-09-15',
          assigned_by: 'User A',
          assigned_to: 'User B',
          completed_at: null,
          attachments: 'file1.pdf',
        },
        // เพิ่มข้อมูลเพิ่มเติมตามต้องการ
      ];

  return (
    <div className="overflow-x-auto">
<a href="/to-do/add">
<button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">New To-Do</button>
</a>
    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        <tr>
          <th className="px-4 py-2 border">ID</th>
          <th className="px-4 py-2 border">Task Name</th>
          <th className="px-4 py-2 border">Description</th>
          <th className="px-4 py-2 border">Status</th>
          <th className="px-4 py-2 border">Priority</th>
          <th className="px-4 py-2 border">Due Date</th>
          <th className="px-4 py-2 border">Created At</th>
          <th className="px-4 py-2 border">Updated At</th>
          <th className="px-4 py-2 border">Assigned By</th>
          <th className="px-4 py-2 border">Assigned To</th>
          <th className="px-4 py-2 border">Completed At</th>
          <th className="px-4 py-2 border">Attachments</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td className="px-4 py-2 border">{task.id}</td>
            <td className="px-4 py-2 border">{task.task_name}</td>
            <td className="px-4 py-2 border">{task.description}</td>
            <td className="px-4 py-2 border">{task.status}</td>
            <td className="px-4 py-2 border">{task.priority}</td>
            <td className="px-4 py-2 border">{task.due_date}</td>
            <td className="px-4 py-2 border">{task.created_at}</td>
            <td className="px-4 py-2 border">{task.updated_at}</td>
            <td className="px-4 py-2 border">{task.assigned_by}</td>
            <td className="px-4 py-2 border">{task.assigned_to}</td>
            <td className="px-4 py-2 border">{task.completed_at}</td>
            <td className="px-4 py-2 border">{task.attachments}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
}
