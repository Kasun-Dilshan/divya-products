import { getSessionFromCookies } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import AdminProductsManager from "@/components/AdminProductsManager";

export default async function AdminProductsPage() {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  return <AdminProductsManager />;
}
