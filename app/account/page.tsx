import { getSessionFromCookies } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import AccountOrdersPage from "@/components/AccountOrdersPage";

export default async function AccountPage() {
  const session = await getSessionFromCookies();
  if (!session) {
    redirect("/login");
  }

  return <AccountOrdersPage />;
}
