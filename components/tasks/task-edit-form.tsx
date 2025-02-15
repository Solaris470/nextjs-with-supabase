'use client';

import React from "react";
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
  import { addDays, format } from "date-fns"
  import { DateRange } from "react-day-picker"
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import { Button } from "@/components/ui/button"
  import { CalendarIcon } from "lucide-react";
  import { Calendar } from "@/components/ui/calendar"

interface TaskEditFormProps {
  taskId: string;
  categories: any;
  projects: any;
  onClose: () => void;
}

export default function TaskEditForm(
  { taskId,
    projects,
    categories,
     onClose 
  }: TaskEditFormProps
  , {
      className,
    }: React.HTMLAttributes<HTMLDivElement>) {
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [category, setCategory] = useState('');
  const [project, setProject] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const supabase = createClient();
  const router = useRouter();
  const [date, setDate] = React.useState<DateRange | undefined>({
          from: new Date(),
          to: new Date(addDays(new Date(), 1)),
        });

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

      setProject(data.project_id);
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

  const setToMidnight = (date: Date | undefined) => {
    if (!date) return date;
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

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
        start_date: setToMidnight(date?.from),
        end_date: setToMidnight(addDays(date?.to, 1)), // เพิ่ม 1 วันให้กับวันที่สิ้นสุด
        project_id: project,
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
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="project"
          >
            เลือกโปรเจกต์ :
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="project"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            required
          >
            <option value="">Select project</option>
            {projects.map((project: any) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

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
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="category"
          >
            ประเภทงาน :
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select category</option>
            {categories.map((category: any) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className={cn("grid gap-2 mb-4", className)}>
          <div>
            <label htmlFor="">วันที่เริ่มต้น - วันที่สิ้นสุด :</label>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
              <CalendarIcon />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

      {/* <div className="mb-4">
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
      </div> */}

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