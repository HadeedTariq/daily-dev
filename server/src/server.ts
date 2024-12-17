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

import session from "express-session";
import { createTable } from "./db/createTable";
import { env } from "./common/utils/envConfig";
import passport from "passport";
import {
  Strategy as GitHubStrategy,
  Profile as GitHubProfile,
} from "passport-github2";

const logger = pino({ name: "server start" });
export const db = connectToDb();
// createTable(`
//   CREATE TABLE about (
//     id SERIAL PRIMARY KEY,
//     user_id INT NOT NULL,
//     bio VARCHAR(255),
//     company VARCHAR(255),
//     job_title VARCHAR(255),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
// );

// CREATE TABLE social_links (
//     id SERIAL PRIMARY KEY,
//     user_id INT NOT NULL,
//     github VARCHAR(255),
//     linkedin VARCHAR(255),
//     your_website VARCHAR(255),
//     x VARCHAR(255),
//     youtube VARCHAR(255),
//     stack_overflow VARCHAR(255),
//     reddit VARCHAR(255),
//     roadmap_sh VARCHAR(255),
//     codepen VARCHAR(255),
//     mastodon VARCHAR(255),
//     threads VARCHAR(255),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
// );

// `);

const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);
app.use(cookieParser());

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(helmet());
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Use GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: GitHubProfile,
      done: (err: any, user?: User | false) => void
    ) => {
      const user: User = {
        id: profile.id.toString(),
        username: profile.username || "",
        name: profile.displayName || "",
        email: profile.emails?.map((email: any) => email.value)[0] as string,
        avatar: profile.photos ? profile.photos[0].value : "",
      };
      return done(null, user);
    }
  )
);

passport.serializeUser(((user: User, done: (err: any, user?: User) => void) => {
  done(null, user);
}) as any);

passport.deserializeUser(
  (user: User, done: (err: any, user?: User | null) => void) => {
    done(null, user);
  }
);

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
