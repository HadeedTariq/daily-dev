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

import { env } from "./common/utils/envConfig";
import passport from "passport";
import {
  Strategy as GitHubStrategy,
  Profile as GitHubProfile,
} from "passport-github2";
import { profileRouter } from "./routes/profile/profile.routes";
import { postRouter } from "./routes/posts/posts.routes";
import { squadRouter } from "./routes/squads/squad.routes";

import { followersRouter } from "./routes/followers/followers.routes";

const logger = pino({ name: "server start" });

const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);
app.use(cookieParser());

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://daily-dev-client.vercel.app"],
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
  })
);
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
      callbackURL: "https://dailydev-backend.vercel.app/auth/github/callback",
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
app.use("/follower", followersRouter);
// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());
app.use(reqErrorHandler);

export { app, logger };
