import { isAuthenticated } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import Create from "./create-form";

export default async function CreatePage() {
  const isAuth = await isAuthenticated();

  if (!isAuth) {
    redirect("/auth/login?redirect=/create");
  }

  return <Create />;
}
