export const env = {
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || "https://foodhubx.vercel.app/",
  },
  api_url:
    process.env.NEXT_PUBLIC_API_URL || "https://foodhub-b.vercel.app/api/v1",
  node_env: process.env.NODE_ENV || "development",
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
} as const;
