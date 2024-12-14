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
import { createTable } from "./db/createTable";

const logger = pino({ name: "server start" });
export const db = connectToDb();
// createTable(`
//   DROP TABLE IF EXISTS magicLinks;
//   DROP TABLE IF EXISTS users;
//   CREATE TABLE magicLinks (
//     email VARCHAR(100) UNIQUE  NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     token VARCHAR(1000) NOT NULL
// );
// CREATE  TABLE users (
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(100) NOT NULL,
//     username VARCHAR(100) NOT NULL,
//     email VARCHAR(100) UNIQUE NOT NULL,
//     profession VARCHAR(100) NOT NULL,
//     user_password VARCHAR(255) NOT NULL,
//     refresh_token VARCHAR(255),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     is_verified BOOLEAN DEFAULT FALSE
// );

// `);

const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

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
