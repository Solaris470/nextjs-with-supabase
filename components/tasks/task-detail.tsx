'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import moment from "moment";
import { useUserRole } from '@/context/userRoleContext';

interface TaskDetailsProps {
  taskId: string;
  userId: string;
  onClose: () => void;
}

export default function TaskDetails({ taskId, userId, onClose }: TaskDetailsProps) {
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
    }

    fetchTask();
  }, [taskId]);

  const handleAcceptTask = async () => {
    console.log('Accepting task:', userId);
    
    const { error } = await supabase
      .from('tasks')
      .update({ assigned_to: userId })
      .eq('id', taskId);

    if (error) {
      console.error('Error accepting task:', error.message);
      alert('Error accepting task. Please try again.');
    } else {
      alert('Task accepted successfully!');
      onClose();
      router.refresh();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">รายละเอียดงาน</h2>
      <p><strong>ชื่องาน:</strong> {task.to_do_name}</p>
      <p><strong>คำอธิบาย:</strong> {task.description}</p>
      <div className="flex items-center">
      <strong>สถานะของงาน: </strong>
          <span
            className={`w-2.5 h-2.5 rounded-full me-2 ${
              task.status === "Pending"
                ? "bg-indigo-500"
                : task.status === "In Progress"
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
          ></span>
        {task.status}
        </div>
      <p><strong>ความสำคัญ:</strong> {task.priority}</p>
      <p><strong>ประเภทงาน:</strong> {task.category_id}</p>
      <p><strong>วันที่เริ่มงาน:</strong> {moment(task.start_date).format("DD MMM YYYY")}</p>
      <p><strong>วันที่สิ้นสุดงาน:</strong> {moment(task.end_date).format("DD MMM YYYY")}</p>

    {task.assigned_to === null && (
      <button
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleAcceptTask}
      >
        รับงาน
      </button>
    )}
    </div>
  );
}
