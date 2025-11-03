import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import DashboardClient from "./DashboardClient";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="p-6">
        <p>You’re not signed in.</p>
        <a className="underline" href="/login">Go to login</a>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Welcome, {session.user.email}</h1>
      <a className="underline" href="/api/auth/signout">Sign out</a>

      {/* Embed the interactive client here */}
      <DashboardClient />
    </div>
  );
}
