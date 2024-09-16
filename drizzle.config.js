/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://neondb_owner:6Or4oXTHIvAU@ep-purple-wave-a55qrsj2.us-east-2.aws.neon.tech/ai-interview-mocker?sslmode=require',
    }
  };