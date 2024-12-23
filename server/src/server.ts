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

import cookieParser from "cookie-parser";

import session from "express-session";
import { createTable } from "./db/createTable";
import { env } from "./common/utils/envConfig";
import passport from "passport";
import {
  Strategy as GitHubStrategy,
  Profile as GitHubProfile,
} from "passport-github2";
import { profileRouter } from "./routes/profile/profile.routes";
import { postRouter } from "./routes/posts/posts.routes";
import { squadRouter } from "./routes/squads/squad.routes";

const logger = pino({ name: "server start" });

// createTable(`
// CREATE TABLE squads (
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(255) UNIQUE NOT NULL,
//     squad_handle VARCHAR(255) UNIQUE NOT NULL,
//     description TEXT,
//     category VARCHAR(100),
//     is_public BOOLEAN DEFAULT TRUE,
//     admin_id INT NOT NULL,
//     post_creation_allowed_to post_content DEFAULT 'members',
//     invitation_permission post_content DEFAULT 'members',
//     post_approval_required BOOLEAN DEFAULT FALSE,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (admin_id) REFERENCES users (id) ON DELETE CASCADE
// );

// CREATE TYPE squad_roles AS ENUM ('member', 'moderator', 'admin');

// CREATE TABLE squad_members (
//     id SERIAL PRIMARY KEY,
//     squad_id INT NOT NULL,
//     user_id INT NOT NULL,
//     role squad_roles DEFAULT 'member',
//     joined_at TIMESTAMP DEFAULT NOW(),
//     FOREIGN KEY (squad_id) REFERENCES squads(id) ON DELETE CASCADE,
//     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
app.use("/profile", profileRouter);
app.use("/posts", postRouter);
app.use("/squad", squadRouter);
// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());
app.use(reqErrorHandler);

export { app, logger };
