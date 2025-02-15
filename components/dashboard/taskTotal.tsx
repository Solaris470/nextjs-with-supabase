'use client';

import { useEffect, useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from 'next/navigation';

export default function TaskTotal() {
    const [totalTasks, setTotalTasks] = useState(0);
    const searchParams = useSearchParams();
    const supabase = createClient();
    const projectId = searchParams.get('projectId');

    useEffect(() => {
        async function fetchTotalTasks() {
            try {
                // สร้าง query พื้นฐาน
                let query = supabase
                    .from('tasks')
                    .select('*', { count: 'exact', head: true });

                // ถ้ามีการเลือกโปรเจค ให้เพิ่มเงื่อนไขในการ filter
                if (projectId && projectId !== 'all') {
                    query = query.eq('project_id', projectId);
                }

                // ดึงข้อมูล
                const { count, error } = await query;

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
    }, [projectId]); // เพิ่ม projectId ใน dependencies เพื่อให้ useEffect ทำงานเมื่อ projectId เปลี่ยน

    return (
        <div className="p-4 h-full flex items-center justify-center gap-y-3 flex-col">  
            <p className="text-7xl font-bold">{totalTasks}</p>
            <p className="text-gray-500">Total tasks</p>
        </div>
    );
}