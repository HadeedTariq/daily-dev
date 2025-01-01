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
import { deleteUnverifiedUsers } from "./db/connect";

const logger = pino({ name: "server start" });

// createTable(`
//       INSERT INTO posts (title, thumbnail, content, squad_id, author_id) VALUES
//       ('Introduction to SQL', 'https://img.freepik.com/free-vector/gradient-ui-ux-background_23-2149065782.jpg', 'This post covers the basics of SQL.', 4, 2),
//       ('Understanding Digital Marketing', 'https://img.freepik.com/free-vector/gradient-ui-ux-background_23-2149065782.jpg', 'Digital marketing strategies explained.', 4, 15),
//       ('Project Management 101', 'https://img.freepik.com/free-vector/gradient-ui-ux-background_23-2149065782.jpg', 'Effective project management tips.', 4, 16),
//       ('The Role of a Data Analyst', 'https://img.freepik.com/free-vector/gradient-ui-ux-background_23-2149065782.jpg', 'Exploring data analyst responsibilities.', 4, 18),
//       ('Designing for Success', 'https://img.freepik.com/free-vector/gradient-ui-ux-background_23-2149065782.jpg', 'Key principles of UI/UX design.', 4, 21);

//       -- Insert tags
//       INSERT INTO tags (name) VALUES
//       ('SQL'),
//       ('Digital Marketing'),
//       ('Project Management'),
//       ('Data Analysis'),
//       ('UI/UX Design');

//       -- Insert post_tags
//       INSERT INTO post_tags (post_id, tag_id) VALUES
//       (1, 1),
//       (2, 2),
//       (3, 3),
//       (4, 4),
//       (5, 5);

//       -- Insert post upvotes
//       INSERT INTO post_upvotes (post_id, upvotes) VALUES
//       (1, 10),
//       (2, 15),
//       (3, 8),
//       (4, 20),
//       (5, 25);

//       -- Insert post views
//       INSERT INTO post_views (post_id, views) VALUES
//       (1, 100),
//       (2, 150),
//       (3, 80),
//       (4, 200),
//       (5, 250);

// `);

const app: Express = express();

// deleteUnverifiedUsers();

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
