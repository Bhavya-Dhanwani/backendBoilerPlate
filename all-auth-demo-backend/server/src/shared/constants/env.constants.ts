const envConstants = {
    PORT: 5000,
    NODE_ENV: "development",
    MONGO_URI: "mongodb://localhost:27017/all-auth-demo-backend",
    ACCESS_TOKEN_SECRET: "super_secret_access_token_key",
    REFRESH_TOKEN_SECRET: "super_secret_refresh_token_key",
    FRONTEND_URL: "http://localhost:3000",
    SEND_MAIL: false,
    SENDING_USER: "noreply@example.com",
    SMTP_HOST: "smtp.gmail.com",
    SMTP_PORT: "587",
    SMTP_USER: "",
    SMTP_PASS: "",
    GOOGLE_CLIENT_ID: "",
    GOOGLE_CLIENT_SECRET: "",
    GOOGLE_REDIRECT_URI: "http://localhost:5000/api/auth/google/callback",
} as const;

export default envConstants;
