import { SignupForm } from "@/features/auth/components/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signup",
  description: "Create a new account",
};

export default async function Page({
  searchParams,
}: {
  searchParams?: { role?: string | string[] };
}) {
  const { role } = (await searchParams) || {};
  const defaultRole = role === "PROVIDER" ? "PROVIDER" : "CUSTOMER";

  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 md:p-0">
      <div className="w-full max-w-sm">
        <SignupForm defaultRole={defaultRole} />
      </div>
    </div>
  );
}
