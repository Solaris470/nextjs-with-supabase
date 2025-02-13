'use client';

import { useEffect, useState } from 'react';
import { createClient } from "@/utils/supabase/client";

export default function TaskTotal() {
    const [totalTasks, setTotalTasks] = useState(0);
    const supabase = createClient();

    useEffect(() => {
        async function fetchTotalTasks() {
            try {
                // ดึงจำนวนงานทั้งหมดจากตาราง task
                const { count, error } = await supabase
                    .from('tasks')
                    .select('*', { count: 'exact', head: true });

                if (error) {
                    console.error('Error fetching tasks:', error);
                    return;
                }

                setTotalTasks(count || 0);
            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchTotalTasks();
    }, []);

    return (
        <>
        <div className="p-4 h-full flex items-center justify-center gap-y-3 flex-col">  
            <p className="text-7xl font-bold">{totalTasks}</p>
            <p className="text-gray-500">Total tasks</p>
        </div>
        </>
    );
}