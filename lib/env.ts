export const env = {
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
  api_url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",
  node_env: process.env.NODE_ENV || "development",
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
} as const;
