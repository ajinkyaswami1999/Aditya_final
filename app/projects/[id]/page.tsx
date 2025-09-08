// app/projects/[id]/page.tsx

import { projectsApi } from '@/lib/supabase';
import ProjectDetailClient from './ProjectDetailClient';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const projects = await projectsApi.getAll();

  return projects.map((project) => ({
    id: project.id.toString(),
  }));
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await projectsApi.getById(params.id);
  const allProjects = await projectsApi.getAll();

  if (!project) return notFound();

  return (
    <ProjectDetailClient project={project} allProjects={allProjects} />
  );
}