import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserProjectsAction } from "@/app/actions/project";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const projectsRes = await getUserProjectsAction();

  return (
    <DashboardClient
      initialProjects={projectsRes.success ? projectsRes.data : []}
      userEmail={user?.primaryEmailAddress?.emailAddress}
    />
  );
}
