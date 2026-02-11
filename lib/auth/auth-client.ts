import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://foodhub-api.tariqul.dev",
  basePath: "/api/auth",
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, useSession, signOut } = authClient;
