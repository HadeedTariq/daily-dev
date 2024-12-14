import dotenv from "dotenv";
import { cleanEnv, host, num, port, str, testOnly, url } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly("test"),
    choices: ["development", "production", "test"],
  }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly("http://localhost:5173") }),
  SERVER_DOMAIN: str({ devDefault: testOnly("http://localhost:3000") }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  DATABASE_URL: url({ devDefault: testOnly("http://localhost:3000") }),
  DATABASE_HOST: host({ devDefault: testOnly("localhost") }),
  DATABASE_PORT: port({ devDefault: testOnly(3000) }),
  DATABASE_USER: str({ devDefault: testOnly("user") }),
  DATABASE_PASSWORD: str({ devDefault: testOnly("password") }),
  PASSWORD_SALT: str({ devDefault: testOnly("salt") }),
  JWT_SECRET: str({ devDefault: testOnly("secret") }),
  NODE_MAILER_USER: str({ devDefault: testOnly("user") }),
  NODE_MAILER_PASSWORD: str({ devDefault: testOnly("password") }),
});
