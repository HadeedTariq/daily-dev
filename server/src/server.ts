import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import { openAPIRouter } from "@/api-docs/openAPIRouter";
import errorHandler, {
  reqErrorHandler,
} from "@/common/middleware/errorHandler";
import requestLogger from "./common/middleware/requestLogger";
import { authRouter } from "./routes/auth/auth.routes";
import { connectToDb } from "./db/connect";
import cookieParser from "cookie-parser";
import { passport } from "./utils/passport";
import session from "express-session";
import { createTable } from "./db/createTable";
import { env } from "./common/utils/envConfig";

const logger = pino({ name: "server start" });
export const db = connectToDb();
// createTable(`
//   DROP TABLE IF EXISTS users;

//   CREATE  TABLE users (
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(100) NOT NULL,
//     username VARCHAR(100) NOT NULL,
//     avatar VARCHAR(255)  default 'https://static.vecteezy.com/system/resources/previews/027/708/418/large_2x/default-avatar-profile-icon-in-flat-style-free-vector.jpg',
//     email VARCHAR(100) UNIQUE NOT NULL,
//     profession VARCHAR(100),
//     user_password VARCHAR(255),
//     refresh_token VARCHAR(255),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     is_verified BOOLEAN DEFAULT FALSE
// );

// `);

const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);
app.use(cookieParser());

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(helmet());

// Request logging
app.use(requestLogger);

// Routes
app.use("/auth", authRouter);
// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());
app.use(reqErrorHandler);

export { app, logger };
