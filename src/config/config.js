const dotenv = require("dotenv");

dotenv.config({
  path: process.env.DOTENV_PATH || ".env",
});

module.exports = {
  db: {
    supabaseUrl: process.env.SUPABASE_URL,
    secretKey: process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY,
  },
  server: {
    baseUrl: process.env.SERVER_BASE_URL || "http://localhost:5001",
    port: process.env.SERVER_PORT || 5001,
  },
  jwt: {
    secretJWT: process.env.SECRET_JWT,
  },
};
