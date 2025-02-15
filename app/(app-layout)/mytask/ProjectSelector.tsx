// ProjectSelector.tsx
'use client'

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Project {
  id: string;
  name: string;
}

interface ProjectSelectorProps {
  projects: Project[];
}

export default function ProjectSelector({ projects }: ProjectSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentProject = searchParams.get('projectId') || 'all';

  const handleProjectChange = (projectId: string) => {
    if (projectId === 'all') {
      router.push('/mytask');
    } else {
      router.push(`/mytask?projectId=${projectId}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="project-select" className="text-sm font-medium">
        เลือกโปรเจค:
      </label>
      <select
        id="project-select"
        className="bg-white border border-gray-300 rounded-md py-1 px-3 text-sm"
        value={currentProject}
        onChange={(e) => handleProjectChange(e.target.value)}
      >
        <option value="all">ทั้งหมด</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  );
}