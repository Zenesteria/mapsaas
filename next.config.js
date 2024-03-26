/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_API_KEY: process.env.FIREBASE_API_KEY,
    NEXT_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    NEXT_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    NEXT_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    NEXT_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    NEXT_APP_ID: process.env.FIREBASE_APP_ID,
    NEXT_TYPE: process.env.FIREBASE_TYPE,
    NEXT_PRIVATE_KEY_ID: process.env.FIREBASE_PRIVATE_KEY_ID,
    NEXT_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    NEXT_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    NEXT_CLIENT_ID: process.env.FIREBASE_CLIENT_ID,
    NEXT_AUTH_URL: process.env.FIREBASE_AUTH_URL,
    NEXT_TOKEN_URL: process.env.FIREBASE_TOKEN_URL,
    NEXT_AUTH_PROVIDER: process.env.FIREBASE_AUTH_PROVIDER,
    NEXT_CLIENT_CERT: process.env.FIREBASE_CLIENT_CERT,
  },
  staticPageGenerationTimeout:1000
};

module.exports = nextConfig
