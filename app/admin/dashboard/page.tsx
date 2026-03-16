import { getSessionFromCookies } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/AdminDashboard";

export default async function AdminDashboardPage() {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  return <AdminDashboard />;
}
