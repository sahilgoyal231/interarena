import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await currentUser();
  
  if (!user) {
    redirect("/");
  }

  const email = user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress?.toLowerCase();
  
  if (!process.env.ADMIN_EMAILS) {
    redirect("/");
  }

  const adminEmails = process.env.ADMIN_EMAILS
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!email || adminEmails.length === 0 || !adminEmails.includes(email)) {
    redirect("/");
  }

  return <>{children}</>;
}
