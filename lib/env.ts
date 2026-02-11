export const env = {
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
  api: {
    url:
      process.env.NEXT_PUBLIC_API_URL || "https://foodhub-api.tariqul.dev/api",
  },
  node_env: process.env.NODE_ENV || "development",
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
} as const;
