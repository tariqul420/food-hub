import { LoginForm } from "@/features/auth/components/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default async function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 md:p-0">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
