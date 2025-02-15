'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface TaskEditFormProps {
  taskId: string;
  onClose: () => void;
}

export default function TaskEditForm({ taskId, onClose }: TaskEditFormProps) {
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchTask() {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (error) {
        console.error('Error fetching task:', error.message);
        return;
      }

      setTask(data);
      setTaskName(data.to_do_name);
      setDescription(data.description);
      setStatus(data.status);
      setPriority(data.priority);
      setCategory(data.category_id);
      setStartDate(new Date(data.start_date));
      setEndDate(new Date(data.end_date));
      setLoading(false);
    }

    fetchTask();
  }, [taskId]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { error } = await supabase
      .from('tasks')
      .update({
        to_do_name: taskName,
        description: description,
        status: status,
        priority: priority,
        category_id: category,
        start_date: startDate,
        end_date: endDate,
      })
      .eq('id', taskId);

    if (error) {
      console.error('Error updating task:', error.message);
      alert('Error updating task. Please try again.');
    } else {
      onClose();
      router.refresh(); // Refresh the page to show updated task
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="task_name">
          ชื่องาน :
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="task_name"
          type="text"
          placeholder="Enter task name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          คำอธิบายของงาน :
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="description"
          rows={3}
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      <div className="grid gap-4 mb-4 grid-cols-2">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
            สถานะของงาน :
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
            ลำดับความสำคัญของงาน :
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
          ประเภทงาน :
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="category"
          type="text"
          placeholder="Enter category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="start_date">
          วันที่เริ่มต้น :
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="start_date"
          type="date"
          value={startDate ? startDate.toISOString().split('T')[0] : ''}
          onChange={(e) => setStartDate(new Date(e.target.value))}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="end_date">
          วันที่สิ้นสุด :
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="end_date"
          type="date"
          value={endDate ? endDate.toISOString().split('T')[0] : ''}
          onChange={(e) => setEndDate(new Date(e.target.value))}
          required
        />
      </div>

      <div className="flex items-center justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          บันทึกการเปลี่ยนแปลง
        </button>
      </div>
    </form>
  );
}