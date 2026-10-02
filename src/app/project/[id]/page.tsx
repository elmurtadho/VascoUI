import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getProjectByIdAction } from "@/app/actions/project";
import ProjectBuilderClient from "./ProjectBuilderClient";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const { id } = await params;
  const result = await getProjectByIdAction(id);

  if (!result.success || !result.data) {
    redirect("/dashboard");
  }

  return <ProjectBuilderClient project={result.data} />;
}
