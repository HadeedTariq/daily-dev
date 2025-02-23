// src/common/utils/envConfig.ts
import dotenv from "dotenv";
import { cleanEnv, host, num, port, str, testOnly, url } from "envalid";
dotenv.config();
var env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly("test"),
    choices: ["development", "production", "test"]
  }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3e3) }),
  CORS_ORIGIN: str({ devDefault: testOnly("http://localhost:5173") }),
  SERVER_DOMAIN: str({ devDefault: testOnly("http://localhost:3000") }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1e3) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1e3) }),
  DATABASE_URL: url({ devDefault: testOnly("http://localhost:3000") }),
  REDIS_URL: url({ devDefault: testOnly("http://localhost:5173") }),
  DATABASE_HOST: host({ devDefault: testOnly("localhost") }),
  DATABASE_PORT: port({ devDefault: testOnly(3e3) }),
  DATABASE_USER: str({ devDefault: testOnly("user") }),
  DATABASE_PASSWORD: str({ devDefault: testOnly("password") }),
  PASSWORD_SALT: str({ devDefault: testOnly("salt") }),
  JWT_SECRET: str({ devDefault: testOnly("secret") }),
  JWT_REFRESH_TOKEN_SECRET: str({ devDefault: testOnly("secret") }),
  JWT_ACCESS_TOKEN_SECRET: str({ devDefault: testOnly("secret") }),
  GITHUB_CLIENT_ID: str({ devDefault: testOnly("secret") }),
  GITHUB_CLIENT_SECRET: str({ devDefault: testOnly("secret") }),
  NODE_MAILER_USER: str({ devDefault: testOnly("user") }),
  SESSION_SECRET: str({ devDefault: testOnly("user") }),
  NODE_MAILER_PASSWORD: str({ devDefault: testOnly("password") })
});

// src/server.ts
import cors from "cors";
import express3 from "express";
import helmet from "helmet";
import { pino } from "pino";

// src/api-docs/openAPIRouter.ts
import express2 from "express";
import swaggerUi from "swagger-ui-express";

// src/api-docs/openAPIDocumentGenerator.ts
import {
  OpenAPIRegistry as OpenAPIRegistry2,
  OpenApiGeneratorV3
} from "@asteasolutions/zod-to-openapi";

// src/api/healthCheck/healthCheckRouter.ts
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express from "express";
import { z as z2 } from "zod";

// src/api-docs/openAPIResponseBuilders.ts
import { StatusCodes as StatusCodes2 } from "http-status-codes";

// src/common/models/serviceResponse.ts
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
var ServiceResponse = class _ServiceResponse {
  success;
  message;
  responseObject;
  statusCode;
  constructor(success, message, responseObject, statusCode) {
    this.success = success;
    this.message = message;
    this.responseObject = responseObject;
    this.statusCode = statusCode;
  }
  static success(message, responseObject, statusCode = StatusCodes.OK) {
    return new _ServiceResponse(true, message, responseObject, statusCode);
  }
  static failure(message, responseObject, statusCode = StatusCodes.BAD_REQUEST) {
    return new _ServiceResponse(false, message, responseObject, statusCode);
  }
};
var ServiceResponseSchema = (dataSchema) => z.object({
  success: z.boolean(),
  message: z.string(),
  responseObject: dataSchema.optional(),
  statusCode: z.number()
});

// src/api-docs/openAPIResponseBuilders.ts
function createApiResponse(schema, description, statusCode = StatusCodes2.OK) {
  return {
    [statusCode]: {
      description,
      content: {
        "application/json": {
          schema: ServiceResponseSchema(schema)
        }
      }
    }
  };
}

// src/common/utils/httpHandlers.ts
import { StatusCodes as StatusCodes3 } from "http-status-codes";
var handleServiceResponse = (serviceResponse, response) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse);
};

// src/api/healthCheck/healthCheckRouter.ts
var healthCheckRegistry = new OpenAPIRegistry();
var healthCheckRouter = express.Router();
healthCheckRegistry.registerPath({
  method: "get",
  path: "/health-check",
  tags: ["Health Check"],
  responses: createApiResponse(z2.null(), "Success")
});
healthCheckRouter.get("/", (_req, res) => {
  const serviceResponse = ServiceResponse.success("Service is healthy", null);
  return handleServiceResponse(serviceResponse, res);
});

// src/api-docs/openAPIDocumentGenerator.ts
function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry2([healthCheckRegistry]);
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Daily Dev Clone API"
    }
  });
}

// src/api-docs/openAPIRouter.ts
var openAPIRouter = express2.Router();
var openAPIDocument = generateOpenAPIDocument();
openAPIRouter.get("/swagger.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(openAPIDocument);
});
openAPIRouter.use("/", swaggerUi.serve, swaggerUi.setup(openAPIDocument));

// src/common/middleware/errorHandler.ts
import { StatusCodes as StatusCodes4 } from "http-status-codes";
var unexpectedRequest = (_req, res) => {
  res.sendStatus(StatusCodes4.NOT_FOUND);
};
var addErrorToRequestLog = (err, _req, res, next) => {
  res.locals.err = err;
  next(err);
};
var reqErrorHandler = (err, _req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({ message });
};
var errorHandler_default = () => [unexpectedRequest, addErrorToRequestLog];

// src/common/middleware/requestLogger.ts
import { randomUUID } from "node:crypto";
import { StatusCodes as StatusCodes5, getReasonPhrase } from "http-status-codes";
import { pinoHttp } from "pino-http";
var requestLogger = (options) => {
  const pinoOptions = {
    enabled: env.isProduction,
    customProps,
    redact: [],
    genReqId,
    customLogLevel,
    customSuccessMessage,
    customReceivedMessage: (req) => `request received: ${req.method}`,
    customErrorMessage: (_req, res) => `request errored with status code: ${res.statusCode}`,
    customAttributeKeys,
    ...options
  };
  return [responseBodyMiddleware, pinoHttp(pinoOptions)];
};
var customAttributeKeys = {
  req: "request",
  res: "response",
  err: "error",
  responseTime: "timeTaken"
};
var customProps = (req, res) => ({
  request: req,
  response: res,
  error: res.locals.err,
  responseBody: res.locals.responseBody
});
var responseBodyMiddleware = (_req, res, next) => {
  const isNotProduction = !env.isProduction;
  if (isNotProduction) {
    const originalSend = res.send;
    res.send = (content) => {
      res.locals.responseBody = content;
      res.send = originalSend;
      return originalSend.call(res, content);
    };
  }
  next();
};
var customLogLevel = (_req, res, err) => {
  if (err || res.statusCode >= StatusCodes5.INTERNAL_SERVER_ERROR) return "error" /* Error */;
  if (res.statusCode >= StatusCodes5.BAD_REQUEST) return "warn" /* Warn */;
  if (res.statusCode >= StatusCodes5.MULTIPLE_CHOICES) return "silent" /* Silent */;
  return "info" /* Info */;
};
var customSuccessMessage = (req, res) => {
  if (res.statusCode === StatusCodes5.NOT_FOUND) return getReasonPhrase(StatusCodes5.NOT_FOUND);
  return `${req.method} completed`;
};
var genReqId = (req, res) => {
  const existingID = req.id ?? req.headers["x-request-id"];
  if (existingID) return existingID;
  const id = randomUUID();
  res.setHeader("X-Request-Id", id);
  return id;
};
var requestLogger_default = requestLogger();

// src/routes/auth/auth.routes.ts
import { Router } from "express";

// src/db/connect.ts
import Redis from "ioredis";
import { Pool } from "pg";
var redis = new Redis(env.REDIS_URL);
var pool = new Pool({
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  database: "defaultdb",
  ssl: {
    rejectUnauthorized: false
  }
});
var queryDb = async (query, params = []) => {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result;
  } finally {
    client.release();
  }
};
var runIndependentTransaction = async (queries) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await Promise.all(queries.map((q) => client.query(q.query, q.params)));
    await client.query("COMMIT");
    console.log("Transaction committed successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Transaction failed and rolled back:", error);
    throw error;
  } finally {
    client.release();
    console.log("Database client released");
  }
};

// src/routes/auth/auth.controller.ts
import { sign, verify } from "jsonwebtoken";
import { createCipheriv, createDecipheriv } from "crypto";
import nodeMailer from "nodemailer";
import { hash, compare } from "bcrypt";

// src/queues/emailQueue.ts
import { Queue } from "bullmq";
var emailQueue = new Queue("emailQueue", { connection: redis });
async function addEmailJob(email, magicLink) {
  await emailQueue.add("sendEmail", { email, magicLink });
}

// src/routes/auth/auth.controller.ts
var UserController = class {
  constructor() {
    this.registerUser = this.registerUser.bind(this);
    this.createUser = this.createUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.authenticateUser = this.authenticateUser.bind(this);
    this.authenticateByResfreshToken = this.authenticateByResfreshToken.bind(this);
    this.authenticate_github = this.authenticate_github.bind(this);
  }
  async createUser(req, res, next) {
    const { token } = req.query;
    if (!token) {
      return next({ message: "Token is required", status: 404 });
    }
    try {
      const { rows } = await queryDb(
        `SELECT email FROM magicLinks WHERE token = $1`,
        [token]
      );
      if (rows.length < 1) {
        return next({ status: 404, message: "Invalid token" });
      }
      const decryptedToken = this.decryptToken(token);
      const user = verify(decryptedToken, env.JWT_SECRET);
      if (user.email !== rows[0].email) {
        return next({ status: 404, message: "Incorrect Token" });
      }
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const { rows: userRow } = await client.query(
          `UPDATE users SET is_verified = $1 WHERE email = $2 RETURNING id`,
          [true, user.email]
        );
        if (userRow.length < 1) {
          throw new Error("User not found or already verified");
        }
        const userId = userRow[0].id;
        const queries = [
          {
            query: `DELETE FROM magicLinks WHERE email = $1`,
            params: [user.email]
          },
          {
            query: `INSERT INTO about (user_id, bio, company, job_title) VALUES ($1, '', '', '')`,
            params: [userId]
          },
          {
            query: `INSERT INTO social_links (user_id) VALUES ($1)`,
            params: [userId]
          },
          {
            query: `INSERT INTO user_stats (user_id, followers, following, reputation, views, upvotes)
                    VALUES ($1, 0, 0, 0, 0, 0)`,
            params: [userId]
          },
          {
            query: `INSERT INTO streaks (user_id) VALUES ($1)`,
            params: [userId]
          }
        ];
        await Promise.all(queries.map((q) => client.query(q.query, q.params)));
        await client.query("COMMIT");
        res.status(201).json({ message: "User registered successfully" });
      } catch (error) {
        await client.query("ROLLBACK");
        console.error("Transaction failed:", error);
        return next({ status: 500, message: "Internal Server Error" });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error:", error);
      return next({ status: 500, message: "Internal Server Error" });
    }
  }
  async loginUser(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
      return next({ status: 404, message: "Please fill all the fields" });
    }
    const { rows } = await queryDb(
      `SELECT 
        id,
        name,
        username,
        avatar,
        email,
        user_password,
        profession
       from users where email = $1 and is_verified = $2`,
      [email, true]
    );
    if (rows.length < 1) {
      return next({ message: "User not found", status: 404 });
    }
    const is_correct_password = await this.verifyPassword(
      password,
      rows[0].user_password
    );
    if (!is_correct_password) {
      return next({ message: "Incorrect Credentials", status: 404 });
    }
    const { accessToken, refreshToken } = this.generateAccessAndRefreshToken(
      rows[0]
    );
    await queryDb("update users set refresh_token = $1 where email = $2", [
      refreshToken,
      email
    ]);
    res.cookie("accessToken", accessToken, {
      secure: true,
      httpOnly: false,
      sameSite: "none"
    }).cookie("refreshToken", refreshToken, {
      secure: true,
      httpOnly: false,
      sameSite: "none"
    });
    res.status(200).json({ message: "User logged in successfully" });
  }
  async registerUser(req, res, next) {
    const { name, username, profession, email, password } = req.body;
    if (!username || !name || !profession || !email || !password) {
      return next({ message: "Please fill all the fields", status: 404 });
    }
    const user = await queryDb(`select email from users where email=$1`, [
      email
    ]);
    if (user.rowCount && user.rowCount > 0) {
      return next({ message: "User already exist", status: 404 });
    }
    const expiresIn = "1d";
    const dataStoredInToken = {
      name,
      username,
      profession,
      email
    };
    const signedToken = sign(dataStoredInToken, env.JWT_SECRET, { expiresIn });
    const token = this.encryptToken(signedToken);
    const magicLink = `${env.SERVER_DOMAIN}/auth/register?token=${token}`;
    const hashPassword = await this.hashPassword(password);
    try {
      await runIndependentTransaction([
        {
          query: `INSERT INTO magicLinks (email, token) VALUES ($1, $2)`,
          params: [email, token]
        },
        {
          query: `INSERT INTO users (name, username, profession, email, user_password) VALUES ($1, $2, $3, $4, $5)`,
          params: [
            name,
            username.split(" ").join("-"),
            profession,
            email,
            hashPassword
          ]
        }
      ]);
    } catch (error) {
      return next({
        message: "Already sent verification email or failed to create user",
        status: 400
      });
    }
    await addEmailJob(email, magicLink);
    return res.status(200).json({ message: "Verification email sent soon" });
  }
  async authenticate_github(req, res, next) {
    const user = req.user;
    if (!user?.email) {
      return next({
        message: "We couldn\u2019t retrieve your email from GitHub. To continue, please make your email public or provide an alternative email address in github",
        status: 404
      });
    }
    const { rows, rowCount } = await queryDb(
      `select * from users where email=$1`,
      [user.email]
    );
    if (rowCount && rowCount > 0) {
      if (rows[0].is_verified) {
        const { accessToken, refreshToken } = this.generateAccessAndRefreshToken(rows[0]);
        await queryDb("update users set refresh_token = $1 where email = $2", [
          refreshToken,
          user.email
        ]);
        return res.cookie("accessToken", accessToken, {
          secure: true,
          httpOnly: false,
          sameSite: "none"
        }).cookie("refreshToken", refreshToken, {
          secure: true,
          httpOnly: false,
          sameSite: "none"
        }).redirect(`http://localhost:5173`);
      } else {
        const { accessToken, refreshToken } = this.generateAccessAndRefreshToken(rows[0]);
        await queryDb(
          "update users set refresh_token = $1,is_verified=$2 where email = $3",
          [refreshToken, true, user.email]
        );
        return res.cookie("accessToken", accessToken, {
          secure: true,
          httpOnly: false,
          sameSite: "none"
        }).cookie("refreshToken", refreshToken, {
          secure: true,
          httpOnly: false,
          sameSite: "none"
        }).redirect(`http://localhost:5173`);
      }
    }
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const { rows: authUser } = await client.query(
        "INSERT INTO users (name, username, email, avatar, is_verified) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [
          user.name,
          user.username.split(" ").join("-"),
          user.email,
          user.avatar,
          true
        ]
      );
      user.id = authUser[0].id;
      const { accessToken, refreshToken } = this.generateAccessAndRefreshToken(user);
      const queries = [
        {
          query: `UPDATE users SET refresh_token = $1 WHERE email = $2`,
          params: [refreshToken, user.email]
        },
        {
          query: `INSERT INTO about (user_id, bio, company, job_title) VALUES ($1, '', '', '')`,
          params: [user.id]
        },
        {
          query: `INSERT INTO social_links (user_id, github) VALUES ($1, $2)`,
          params: [user.id, `https://github.com/${user.username}`]
        },
        {
          query: `INSERT INTO user_stats (user_id, followers, following, reputation, views, upvotes)
                  VALUES ($1, 0, 0, 0, 0, 0)`,
          params: [user.id]
        },
        {
          query: `INSERT INTO streaks (user_id) VALUES ($1)`,
          params: [user.id]
        }
      ];
      await Promise.all(queries.map((q) => client.query(q.query, q.params)));
      await client.query("COMMIT");
      return res.cookie("accessToken", accessToken, {
        secure: true,
        httpOnly: false,
        sameSite: "none"
      }).cookie("refreshToken", refreshToken, {
        secure: true,
        httpOnly: false,
        sameSite: "none"
      }).redirect(`http://localhost:5173`);
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Transaction failed:", error);
      return res.status(500).json({ message: "Internal server error" });
    } finally {
      client.release();
      console.log("Database client released");
    }
  }
  authenticateUser(req, res, next) {
    const { user } = req.body;
    return res.status(200).json(user);
  }
  async authenticateByResfreshToken(req, res, next) {
    const { refreshToken: refToken } = req.cookies;
    if (!refToken) {
      return next({ message: "Refresh Token not found", status: 404 });
    }
    const { id } = verify(refToken, env.JWT_REFRESH_TOKEN_SECRET);
    if (!id) {
      return next({ message: "Invalid Refresh Token", status: 404 });
    }
    const { rows } = await queryDb(`SELECT * from users where id = $1`, [id]);
    if (rows.length < 1) {
      return next({ status: 404, message: "User not found" });
    }
    const { accessToken, refreshToken } = this.generateAccessAndRefreshToken(
      rows[0]
    );
    await queryDb(`update users set refresh_token=$1 where email=$2`, [
      refreshToken,
      rows[0].email
    ]);
    res.cookie("accessToken", accessToken, {
      secure: true,
      httpOnly: false,
      sameSite: "none"
    }).cookie("refreshToken", refreshToken, {
      secure: true,
      httpOnly: false,
      sameSite: "none"
    });
    return res.status(200).json({ message: "User logged in by using refreshToken successfully" });
  }
  async logoutUser(req, res, next) {
    res.clearCookie("refreshToken", {
      secure: true,
      httpOnly: false,
      sameSite: "none"
    }).clearCookie("accessToken", {
      secure: true,
      httpOnly: false,
      sameSite: "none"
    }).json({ message: "User logged out successfully" });
  }
  encryptToken = (token) => {
    const key = Buffer.from("12345678901234567890123456789012");
    const algorithm = "aes-256-cbc";
    const initVector = Buffer.from("1234567890abcdef");
    const cipher = createCipheriv(algorithm, key, initVector);
    return cipher.update(token, "utf8", "hex") + cipher.final("hex");
  };
  decryptToken = (token) => {
    const key = Buffer.from("12345678901234567890123456789012");
    const algorithm = "aes-256-cbc";
    const initVector = Buffer.from("1234567890abcdef");
    const decipher = createDecipheriv(algorithm, key, initVector);
    return decipher.update(token, "hex", "utf8") + decipher.final("utf8");
  };
  hashPassword = async (password) => {
    const hashPassword = await hash(password, 16);
    return hashPassword;
  };
  verifyPassword = async (password, actual_password) => {
    const is_correct_password = await compare(password, actual_password);
    return is_correct_password;
  };
  sendMail = async (email, magicLink) => {
    try {
      let transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
          user: String(env.NODE_MAILER_USER),
          pass: String(env.NODE_MAILER_PASSWORD)
        }
      });
      const info = await transporter.sendMail({
        from: "hadeedtariq12@gmail.com",
        to: email,
        subject: "Verification email",
        html: `
        <h1></h1>Please verify your registeration on daily dev by clicking the verification link below:</h1>
        <a href="${magicLink}">${magicLink}</a>
        `
      });
      return { info };
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  };
  generateAccessAndRefreshToken = function(user) {
    const refreshToken = sign({ id: user.id }, env.JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: "15d"
    });
    const accessToken = sign(
      {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        profession: user.profession
      },
      env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: "2d" }
    );
    return { refreshToken, accessToken };
  };
};
var userController = new UserController();

// src/utils/asyncHandler.ts
function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch((err) => {
      console.log(err);
      next(err);
    });
  };
}

// src/routes/auth/auth.routes.ts
import passport from "passport";

// src/routes/middleware.ts
import jwt from "jsonwebtoken";
async function checkAuth(req, res, next) {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      return next({
        message: "Access Token not found",
        status: 404
      });
    }
    const user = jwt.verify(accessToken, env.JWT_ACCESS_TOKEN_SECRET);
    if (!user) {
      return next({
        message: "Invalid Access Token",
        status: 404
      });
    }
    req.body.user = user;
    next();
  } catch (error) {
    return next({
      message: error instanceof jwt.JsonWebTokenError ? "Please authenticate to perform this action" : "Authentication Error",
      status: 401
    });
  }
}

// src/routes/auth/auth.routes.ts
var router = Router();
router.get("/", checkAuth, asyncHandler(userController.authenticateUser));
router.post("/verification", asyncHandler(userController.registerUser));
router.get("/register", asyncHandler(userController.createUser));
router.post("/login", asyncHandler(userController.loginUser));
router.post("/logout", asyncHandler(userController.logoutUser));
router.post(
  "/refreshAccessToken",
  asyncHandler(userController.authenticateByResfreshToken)
);
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  asyncHandler(userController.authenticate_github)
);

// src/server.ts
import cookieParser from "cookie-parser";
import session from "express-session";
import passport2 from "passport";
import {
  Strategy as GitHubStrategy
} from "passport-github2";

// src/routes/profile/profile.routes.ts
import { Router as Router2 } from "express";

// src/routes/profile/profile.controller.ts
import sanitizeHtml from "sanitize-html";
import { DatabaseError } from "pg";
import { sign as sign2 } from "jsonwebtoken";
var ProfileController = class {
  constructor() {
    this.getProfile = this.getProfile.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
    this.editProfile = this.editProfile.bind(this);
    this.readmeHandler = this.readmeHandler.bind(this);
    this.updateStreak = this.updateStreak.bind(this);
    this.getMyJoinedSquads = this.getMyJoinedSquads.bind(this);
    this.getUserJoinedSquads = this.getUserJoinedSquads.bind(this);
    this.isValidSocialLink = this.isValidSocialLink.bind(this);
  }
  async getUserProfile(req, res, next) {
    const { username } = req.params;
    try {
      const query = `
      WITH actual_user AS (
          SELECT 
              a_u.name,
              a_u.username,
              a_u.avatar,
              a_u.email,
              a_u.created_at,
              a_u.profession,
              a_u.id
          FROM 
              users a_u 
          WHERE 
              a_u.username = $1
      )
        SELECT 
            u.name,
            u.id,
            u.username,
            u.avatar,
            u.email,
            u.created_at,
            u.profession,
            EXISTS (
                  SELECT 1 
                  FROM followers f_f
                  WHERE f_f.follower_id = $2 
                    AND f_f.followed_id = u.id
              ) AS current_user_follow,
            json_build_object(
                'id', ab.id,
                'bio', ab.bio,
                'company', ab.company,
                'job_title', ab.job_title,
                'created_at', ab.created_at,
                'readme', ab.readme
            ) AS about,
            json_build_object(
                'id', sl.id,
                'github', sl.github,
                'linkedin', sl.linkedin,
                'website', sl.website,
                'x', sl.x,
                'youtube', sl.youtube,
                'stack_overflow', sl.stack_overflow,
                'reddit', sl.reddit,
                'roadmap_sh', sl.roadmap_sh,
                'codepen', sl.codepen,
                'mastodon', sl.mastodon,
                'threads', sl.threads,
                'created_at', sl.created_at
            ) AS social_links,
            json_build_object(
                'id', ust.id,
                'followers', ust.followers,
                'following', ust.following,
                'reputation', ust.reputation,
                'views', ust.views,
                'upvotes', ust.upvotes
            ) AS user_stats,
            json_build_object(
                'id', stk.id,
                'streak_start', stk.streak_start,
                'streak_end', stk.streak_end,
                'updated_at', stk.updated_at,
                'streak_length', stk.streak_length,
                'longest_streak', stk.longest_streak
            ) AS streaks
        FROM 
            actual_user u
        LEFT JOIN 
            about ab ON u.id = ab.user_id
        LEFT JOIN 
            social_links sl ON u.id = sl.user_id
        LEFT JOIN 
            user_stats ust ON u.id = ust.user_id
        LEFT JOIN 
            streaks stk ON u.id = stk.user_id;
  `;
      const { rows } = await queryDb(query, [username, req.body.user.id]);
      if (rows.length === 0) {
        return next({ status: 404, message: "User not found" });
      }
      res.status(200).json({ profile: rows[0] });
    } catch (error) {
      console.log(error);
      if (error instanceof DatabaseError) {
        return next({ status: 500, message: "Database query error" });
      }
      next(error);
    }
  }
  async getProfile(req, res, next) {
    const { user: authUser } = req.body;
    try {
      const query = `
      WITH actual_user AS (
          SELECT 
              a_u.name,
              a_u.id,
              a_u.username,
              a_u.avatar,
              a_u.email,
              a_u.created_at,
              a_u.profession
          FROM 
              users a_u 
          WHERE 
              a_u.id = $1
      )
        SELECT 
          u.*,
          row_to_json(ab) AS about,
          row_to_json(sl) AS social_links,
          row_to_json(ust) AS user_stats,
          row_to_json(stk) AS streaks
        FROM 
          actual_user u
        LEFT JOIN 
          about ab ON u.id = ab.user_id
        LEFT JOIN 
          social_links sl ON u.id = sl.user_id
        LEFT JOIN 
          user_stats ust ON u.id = ust.user_id
        LEFT JOIN 
          streaks stk ON u.id = stk.user_id
  `;
      const { rows } = await queryDb(query, [authUser.id]);
      if (rows.length === 0) {
        return next({ status: 404, message: "User not found" });
      }
      res.status(200).json({ profile: rows[0] });
    } catch (error) {
      if (error instanceof DatabaseError) {
        return next({ status: 500, message: "Database query error" });
      }
      next(error);
    }
  }
  async getUserJoinedSquads(req, res, next) {
    try {
      const { userId } = req.query;
      if (!userId || isNaN(userId)) {
        return res.status(400).json({ message: "User ID is required." });
      }
      const query = `
          WITH user_squads AS (
              SELECT squad_id 
              FROM squad_members 
              WHERE user_id = $1
          )
          SELECT 
              s.id AS squad_id, 
              s.name AS squad_name, 
              s.squad_handle AS squad_handle,
              s.thumbnail AS squad_thumbnail
          FROM user_squads us
          JOIN squads s ON us.squad_id = s.id;
    `;
      const { rows: squads } = await queryDb(query, [Number(userId)]);
      if (squads.length === 0) {
        return res.status(200).json({
          message: "User have not joined any squads yet.",
          squads: []
        });
      }
      res.status(200).json({
        squads
      });
    } catch (error) {
      next(error);
    }
  }
  async getMyJoinedSquads(req, res, next) {
    try {
      const userId = req.body.user.id;
      const query = `
          WITH user_squads AS (
              SELECT squad_id 
              FROM squad_members 
              WHERE user_id = $1
          )
          SELECT 
              s.id AS squad_id, 
              s.name AS squad_name, 
              s.squad_handle AS squad_handle,
              s.thumbnail AS squad_thumbnail
          FROM user_squads us
          JOIN squads s ON us.squad_id = s.id;
    `;
      const { rows: squads } = await queryDb(query, [userId]);
      if (squads.length === 0) {
        return res.status(200).json({
          message: "You have not joined any squads yet.",
          squads: []
        });
      }
      res.status(200).json({
        squads
      });
    } catch (error) {
      next(error);
    }
  }
  async editProfile(req, res, next) {
    const {
      user,
      username,
      avatar,
      name,
      email,
      profession,
      bio,
      company,
      job_title,
      github,
      linkedin,
      website,
      x,
      youtube,
      stack_overflow,
      reddit,
      roadmap_sh,
      codepen,
      mastodon,
      threads
    } = req.body;
    let accessToken = req.cookies.accessToken;
    if (website) {
      const websiteUrl = new URL(website);
      if (websiteUrl.protocol !== "https" || websiteUrl.hostname.includes("localhost")) {
        return res.status(400).json({ message: "Invalid website URL." });
      }
      const query = `
        UPDATE social_links 
        SET website=$1 
        WHERE user_id = $2 
        RETURNING id;
      `;
      const values = [website, req.body.user.id];
      const { rows: socialLinksRows } = await queryDb(query, values);
      if (socialLinksRows.length === 0) {
        return next({ status: 404, message: "User not found" });
      }
    }
    if (username !== user.username || avatar !== user.avatar || name !== user.name || email !== user.email || profession !== user.profession) {
      console.log("run user profile");
      const query = `UPDATE users SET username=$1, avatar=$2, name=$3, email=$4, profession=$5 WHERE id=$6 RETURNING id`;
      const { rows } = await queryDb(query, [
        username,
        avatar,
        name,
        email,
        profession,
        req.body.user.id
      ]);
      accessToken = sign2(
        {
          id: user.id,
          username,
          name,
          email,
          avatar,
          profession
        },
        env.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: "2d" }
      );
      if (rows.length === 0) {
        return next({ status: 404, message: "User not found" });
      }
    }
    if (bio || company || job_title) {
      console.log("run job");
      const query = `UPDATE about SET bio=$1, company=$2, job_title=$3 WHERE user_id=$4 RETURNING *`;
      const { rows: aboutRows } = await queryDb(query, [
        String(bio),
        String(company),
        String(job_title),
        req.body.user.id
      ]);
      if (aboutRows.length === 0) {
        return next({ status: 404, message: "User not found" });
      }
    }
    const socialFields = {
      github,
      linkedin,
      x,
      youtube,
      stack_overflow,
      reddit,
      roadmap_sh,
      codepen,
      mastodon,
      threads
    };
    const validFields = Object.entries(socialFields).filter(([key, value]) => value && this.isValidSocialLink(key, value)).map(([key, value], index) => ({
      column: key,
      value,
      paramIndex: index + 1
    }));
    console.log(validFields);
    if (validFields.length > 0) {
      console.log("run user social");
      const setClause = validFields.map(({ column }, index) => `${column} = $${index + 1}`).join(", ");
      const values = validFields.map(({ value }) => value);
      values.push(req.body.user.id);
      const query = `
        UPDATE social_links 
        SET ${setClause} 
        WHERE user_id = $${values.length} 
        RETURNING id;
      `;
      const { rows: socialLinksRows } = await queryDb(query, values);
      if (socialLinksRows.length === 0) {
        return next({ status: 404, message: "User not found" });
      }
    }
    res.status(200).cookie("accessToken", accessToken, {
      secure: true,
      httpOnly: false,
      sameSite: "none"
    }).json({ message: "Profile Updated Successfully" });
  }
  async updateStreak(req, res, next) {
    try {
      const { user } = req.body;
      const currentDate = /* @__PURE__ */ new Date();
      const redisKey = `streak:${user.id}`;
      let streakData = await redis.get(redisKey);
      if (streakData) {
        streakData = JSON.parse(streakData);
      } else {
        const { rows } = await queryDb(
          `SELECT updated_at, streak_length, longest_streak FROM streaks WHERE user_id = $1`,
          [user.id]
        );
        if (rows.length === 0) {
          return next({ status: 404, message: "User not found" });
        }
        streakData = rows[0];
        await redis.set(redisKey, JSON.stringify(streakData), "EX", 86400);
      }
      const lastUpdated = new Date(streakData.updated_at);
      const sameDay = currentDate.toISOString().split("T")[0] === lastUpdated.toISOString().split("T")[0];
      if (sameDay) {
        return res.status(204).json({});
      }
      const diffDays = Math.floor(
        (Number(currentDate) - Number(lastUpdated)) / (1e3 * 60 * 60 * 24)
      );
      let query, values;
      if (diffDays > 1) {
        const longestStreak = Math.max(
          streakData.streak_length,
          streakData.longest_streak
        );
        query = `
          UPDATE streaks
          SET streak_length = $1, updated_at = $2, streak_end = $2, streak_start = $2, longest_streak = $3
          WHERE user_id = $4
        `;
        values = [1, currentDate, longestStreak, user.id];
        streakData = {
          streak_length: 1,
          updated_at: currentDate,
          longest_streak: longestStreak
        };
      } else {
        query = `
          UPDATE streaks
          SET streak_length = streak_length + 1, updated_at = $1
          WHERE user_id = $2
        `;
        values = [currentDate, user.id];
        streakData.streak_length += 1;
        streakData.updated_at = currentDate;
      }
      await queryDb(query, values);
      await redis.set(redisKey, JSON.stringify(streakData), "EX", 86400);
      return res.status(201).json({ message: "Streak updated successfully" });
    } catch (error) {
      next(error);
    }
  }
  async readmeHandler(req, res, next) {
    const { readme } = req.body;
    if (!readme || typeof readme !== "string") {
      return res.status(400).json({
        error: 'The "readme" field is required and should be a string.'
      });
    }
    const sanitizedReadme = sanitizeHtml(readme, {
      allowedTags: [],
      allowedAttributes: {}
    });
    const query = "update  about set readme= $1  where user_id = $2";
    const values = [sanitizedReadme, req.body.user.id];
    await queryDb(query, values);
    return res.status(201).json({
      message: "Readme successfully saved."
    });
  }
  isValidSocialLink(type, url2) {
    const domainMap = {
      github: "github.com",
      linkedin: "linkedin.com",
      x: "x.com",
      youtube: "youtube.com",
      stack_overflow: "stackoverflow.com",
      reddit: "reddit.com",
      roadmap_sh: "roadmap.sh",
      codepen: "codepen.io",
      mastodon: "mastodon.social",
      threads: "threads.net"
    };
    try {
      const parsedUrl = new URL(url2);
      return parsedUrl.protocol === "https:" && domainMap[type] ? parsedUrl.hostname.includes(domainMap[type]) : false;
    } catch (error) {
      return false;
    }
  }
};
var profileController = new ProfileController();

// src/routes/profile/profile.routes.ts
var router2 = Router2();
router2.use(checkAuth);
router2.get("/", asyncHandler(profileController.getProfile));
router2.get("/user/:username", asyncHandler(profileController.getUserProfile));
router2.get(
  "/get-my-joined-squads",
  asyncHandler(profileController.getMyJoinedSquads)
);
router2.get(
  "/get-user-joined-squads",
  asyncHandler(profileController.getUserJoinedSquads)
);
router2.put("/edit", asyncHandler(profileController.editProfile));
router2.post("/readme-handler", asyncHandler(profileController.readmeHandler));
router2.put("/update-streak", asyncHandler(profileController.updateStreak));

// src/routes/posts/posts.routes.ts
import { Router as Router3 } from "express";

// src/routes/posts/posts.controller.ts
import sanitizeHtml2 from "sanitize-html";
import nlp from "compromise";
import removeMd from "remove-markdown";
var PostController = class {
  constructor() {
    this.getPosts = this.getPosts.bind(this);
    this.getPostBySlug = this.getPostBySlug.bind(this);
    this.getMyPosts = this.getMyPosts.bind(this);
    this.getUserPosts = this.getUserPosts.bind(this);
    this.getPostComments = this.getPostComments.bind(this);
    this.createPost = this.createPost.bind(this);
    this.editPost = this.editPost.bind(this);
    this.upvotePost = this.upvotePost.bind(this);
    this.viewPost = this.viewPost.bind(this);
    this.commentOnPost = this.commentOnPost.bind(this);
    this.replyToComment = this.replyToComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.updateReply = this.updateReply.bind(this);
    this.upvoteComment = this.upvoteComment.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.deleteCommentReply = this.deleteCommentReply.bind(this);
  }
  getTags = () => {
    const res = [
      "software-engineering",
      "backend-development",
      "frontend-development",
      "full-stack-development",
      "web-development",
      "mobile-development",
      "cloud-computing",
      "artificial-intelligence",
      "machine-learning",
      "data-science",
      "data-engineering",
      "devops",
      "agile-methodology",
      "scrum",
      "test-driven-development",
      "unit-testing",
      "integration-testing",
      "continuous-integration",
      "continuous-deployment",
      "version-control",
      "git",
      "docker",
      "kubernetes",
      "microservices",
      "restful-api",
      "graphql",
      "nodejs",
      "express",
      "reactjs",
      "vuejs",
      "angular",
      "typescript",
      "python",
      "java",
      "ruby-on-rails",
      "cplusplus",
      "go-programming-language",
      "cloud-native",
      "serverless-architecture",
      "cybersecurity",
      "blockchain-technology",
      "database-management",
      "sql",
      "nosql",
      "mongodb",
      "postgresql",
      "mysql",
      "data-structures",
      "algorithms"
    ];
    return res;
  };
  detectTags = (content) => {
    const predefinedTags = this.getTags();
    const doc = nlp(removeMd(content));
    const nouns = doc.nouns().out("array");
    const adjectives = doc.adjectives().out("array");
    const acronyms = doc.acronyms().out("array");
    const adverbs = doc.adverbs().out("array");
    const tags = [
      .../* @__PURE__ */ new Set([...nouns, ...adjectives, ...acronyms, ...adverbs])
    ];
    return tags.reduce((acc, keyword) => {
      const tag = predefinedTags.includes(
        keyword.toLowerCase().split(" ").join("-")
      );
      if (tag) {
        acc.push(keyword.toLowerCase().split(" ").join("-"));
      }
      return acc;
    }, []);
  };
  async getPosts(req, res, next) {
    const { pageSize, cursor, sortingOrder } = req.query;
    const allowedSortingOrders = ["id", "", "upvotes", "views"];
    if (!allowedSortingOrders.includes(String(sortingOrder))) {
      return res.status(400).json({
        message: "Invalid sorting order. Allowed values: 'id', '', 'upvotes', 'views'."
      });
    }
    try {
      let query = "";
      if (sortingOrder === "id" || sortingOrder === "") {
        query = `
        WITH paginated_posts AS (
            SELECT id
            FROM posts
            where id > $2
            ORDER BY id ASC
            LIMIT $3
        )
        SELECT 
            p.id,
            p.title,
            p.thumbnail,
            p.content,
            p.slug,
            p.tags,
            p.created_at,
            p_v.upvotes AS upvotes,
            p_vw.views AS views,
            JSON_BUILD_OBJECT(
                'squad_thumbnail', p_sq.thumbnail,
                'squad_handle', p_sq.squad_handle
            ) AS squad_details,
            JSON_BUILD_OBJECT(
                'author_avatar', u.avatar,
                'author_name', u.name,
                'author_username', u.username,
                'author_id', u.id
            ) AS author_details,
            EXISTS (
                SELECT 1 
                FROM user_upvotes u_u_v 
                WHERE u_u_v.user_id = $1 
                  AND u_u_v.post_id = p.id
            ) AS current_user_upvoted
        FROM paginated_posts pp
        JOIN posts p ON pp.id = p.id
        JOIN post_upvotes p_v ON p.id = p_v.post_id
        JOIN post_views p_vw ON p.id = p_vw.post_id
        JOIN squads p_sq ON p.squad_id = p_sq.id
        JOIN users u ON p.author_id = u.id
        ORDER BY p.id;
    `;
        const { rows } = await queryDb(query, [
          req.body.user.id,
          cursor,
          pageSize ? pageSize : 1
        ]);
        return res.status(200).json({ posts: rows });
      }
      if (sortingOrder === "upvotes") {
        query = `
         WITH paginated_posts AS (
             SELECT p.id, p_v.upvotes
              FROM posts p
              INNER JOIN post_upvotes p_v ON p.id = p_v.post_id
              WHERE (p_v.upvotes < $2 OR (p_v.upvotes = $2 AND p.id < $3))  
              ORDER BY p_v.upvotes DESC, p.id DESC 
              LIMIT $4
          )
          SELECT 
              p.id,
              p.title,
              p.thumbnail,
              p.content,
              p.slug,
              p.tags,
              p.created_at,
              pp.upvotes AS upvotes,
              p_vw.views AS views,
              JSON_BUILD_OBJECT(
                  'squad_thumbnail', p_sq.thumbnail,
                  'squad_handle', p_sq.squad_handle
              ) AS squad_details,
              JSON_BUILD_OBJECT(
                  'author_avatar', u.avatar,
                  'author_name', u.name,
                  'author_username', u.username,
                  'author_id', u.id
              ) AS author_details,
              EXISTS (
                  SELECT 1 
                  FROM user_upvotes u_u_v 
                  WHERE u_u_v.user_id = $1 
                    AND u_u_v.post_id = p.id
              ) AS current_user_upvoted
          FROM paginated_posts pp
          JOIN posts p ON pp.id = p.id
          JOIN post_views p_vw ON p.id = p_vw.post_id
          JOIN squads p_sq ON p.squad_id = p_sq.id
          JOIN users u ON p.author_id = u.id
          ORDER BY pp.upvotes DESC;
    `;
        const upvotes = cursor?.toString().split(",")[0].split(":")[1];
        const postId = cursor?.toString().split(",")[1].split(":")[1];
        const { rows } = await queryDb(query, [
          req.body.user.id,
          upvotes,
          postId,
          pageSize ? pageSize : 1
        ]);
        return res.status(200).json({ posts: rows });
      }
      if (sortingOrder === "views") {
        query = `
             WITH paginated_posts AS (
                  SELECT 
                  p.id,
                  p_vw.views,
                  p_v.upvotes AS upvotes
                  FROM posts p
                  INNER JOIN post_views p_vw ON p.id = p_vw.post_id
                  JOIN post_upvotes p_v ON p.id = p_v.post_id
                  WHERE (p_vw.views < $2 OR (p_vw.views = $2 AND p.id < $3))  
                  ORDER BY p_vw.views DESC, p.id DESC 
                  LIMIT $4
              )
              SELECT
                  p.id,
                  p.title,
                  p.thumbnail,
                  p.content,
                  p.slug,
                  p.tags,
                  p.created_at,
                  pp.views AS views,
                  pp.upvotes AS upvotes,
                  JSON_BUILD_OBJECT(
                      'squad_thumbnail', p_sq.thumbnail,
                      'squad_handle', p_sq.squad_handle
                  ) AS squad_details,
                  JSON_BUILD_OBJECT(
                      'author_avatar', u.avatar,
                      'author_name', u.name,
                      'author_username', u.username,
                      'author_id', u.id
                  ) AS author_details,
                  EXISTS (
                      SELECT 1
                      FROM user_upvotes u_u_v
                      WHERE u_u_v.user_id = $1
                        AND u_u_v.post_id = p.id
                  ) AS current_user_upvoted
              FROM paginated_posts pp
              JOIN posts p ON pp.id = p.id
              JOIN post_views p_vw ON p.id = p_vw.post_id
              JOIN squads p_sq ON p.squad_id = p_sq.id
              JOIN users u ON p.author_id = u.id
              ORDER BY pp.views DESC;
        `;
        const views = cursor?.toString().split(",")[0].split(":")[1];
        const postId = cursor?.toString().split(",")[1].split(":")[1];
        const { rows } = await queryDb(query, [
          req.body.user.id,
          views,
          postId,
          pageSize ? pageSize : 1
        ]);
        return res.status(200).json({ posts: rows });
      }
    } catch (error) {
      next(error);
    }
  }
  async getPostBySlug(req, res, next) {
    const { postSlug } = req.query;
    if (!postSlug) {
      return res.status(400).json({ message: "Post Slug is required." });
    }
    try {
      const query = `
      with required_post as(
      select  
          r_p.id,
          r_p.title,
          r_p.thumbnail,
          r_p.content,
          r_p.slug,
          r_p.created_at,
          r_p.tags,
          r_p.squad_id,
          r_p.author_id
      from posts r_p where r_p.slug = $2
      )
      SELECT 
          p.*,
          p_v.upvotes AS upvotes,
          p_vw.views AS views,
          JSON_BUILD_OBJECT(
              'squad_thumbnail', p_sq.thumbnail,
              'squad_handle', p_sq.squad_handle
          ) AS squad_details,
          JSON_BUILD_OBJECT(
              'author_avatar', u.avatar,
              'author_name', u.name,
              'author_username', u.username
          ) AS author_details,
          EXISTS (
              SELECT 1 
              FROM user_upvotes u_u_v 
              WHERE u_u_v.user_id = $1 
                AND u_u_v.post_id = p.id
          ) AS current_user_upvoted
      FROM required_post p
      INNER JOIN post_upvotes p_v ON p.id = p_v.post_id
      INNER JOIN post_views p_vw ON p.id = p_vw.post_id
      INNER JOIN squads p_sq ON p.squad_id = p_sq.id
      INNER JOIN users u ON p.author_id = u.id
  `;
      const { rows } = await queryDb(query, [req.body.user.id, postSlug]);
      res.status(200).json(rows[0]);
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
      next(error);
    }
  }
  async getUserPosts(req, res, next) {
    const { userId } = req.query;
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: "User ID is required." });
    }
    try {
      const query = `
      WITH user_posts AS (
        SELECT  
            p.id,
            p.thumbnail,
            p.title,
            p.content,
            p.slug,
            p.created_at,
            p.squad_id
        FROM posts p
        WHERE p.author_id = $1
      )
      SELECT 
            p.*,
            JSON_BUILD_OBJECT(
                'squad_thumbnail', p_sq.thumbnail,
                'squad_handle', p_sq.squad_handle
            ) AS squad_details
        FROM user_posts p
        INNER JOIN squads p_sq ON p.squad_id = p_sq.id;
  `;
      const { rows } = await queryDb(query, [Number(userId)]);
      res.status(200).json({ posts: rows });
    } catch (error) {
      next(error);
    }
  }
  async getMyPosts(req, res, next) {
    try {
      const query = `
      WITH user_posts AS (
        SELECT  
            p.id,
            p.thumbnail,
            p.title,
            p.content,
            p.slug,
            p.created_at,
            p.squad_id
        FROM posts p
        WHERE p.author_id = $1
      )
      SELECT 
            p.*,
            JSON_BUILD_OBJECT(
                'squad_thumbnail', p_sq.thumbnail,
                'squad_handle', p_sq.squad_handle
            ) AS squad_details
        FROM user_posts p
        INNER JOIN squads p_sq ON p.squad_id = p_sq.id;
  `;
      const { rows } = await queryDb(query, [req.body.user.id]);
      res.status(200).json({ posts: rows });
    } catch (error) {
      next(error);
    }
  }
  async getPostComments(req, res, next) {
    const { postId } = req.params;
    const { pageSize, pageNumber } = req.query;
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required." });
    }
    try {
      const commentsQuery = `
     WITH current_post_comments AS (
            SELECT c.id, c.content, c.created_at, c.updated_at, c.edited, c.user_id
            FROM post_comments c
            WHERE c.post_id = $1
            ORDER BY c.id
            LIMIT $3 OFFSET ($4 - 1) * $3
        ),
        comment_upvotes_count AS (
            SELECT comment_id, COUNT(*) AS total_upvotes
            FROM comment_upvotes
            GROUP BY comment_id
        ),
        comment_upvotes_user AS (
            SELECT comment_id, 1 AS current_user_upvoted
            FROM comment_upvotes
            WHERE user_id = $2
        ),
        replies_agg AS (
            SELECT cr.comment_id, 
                  JSON_AGG(
                      JSON_BUILD_OBJECT(
                          'id', cr.id,
                          'content', cr.content,
                          'created_at', cr.created_at,
                          'updated_at', cr.updated_at,
                          'edited', cr.edited,
                          'sender_details', JSON_BUILD_OBJECT(
                              'name', s.name,
                              'username', s.username,
                              'avatar', s.avatar,
                              'id', s.id
                          ),
                          'recipient_details', JSON_BUILD_OBJECT(
                              'name', r.name,
                              'username', r.username,
                              'avatar', r.avatar,
                              'id', r.id
                          )
                      )
                  ) AS replies
            FROM comment_replies cr
            LEFT JOIN users s ON s.id = cr.sender_id
            LEFT JOIN users r ON r.id = cr.recipient_id
            GROUP BY cr.comment_id
        )
        SELECT 
            c.content,
            c.created_at,
            c.updated_at,
            c.edited,
            c.id,
            JSON_BUILD_OBJECT(
                'name', u.name,
                'username', u.username,
                'avatar', u.avatar,
                'id', u.id
            ) AS user_details,
            COALESCE(cuv.current_user_upvoted, 0) AS current_user_upvoted,
            COALESCE(cuc.total_upvotes, 0) AS total_upvotes,
            COALESCE(ra.replies, '[]') AS replies
        FROM current_post_comments c
        INNER JOIN users u ON u.id = c.user_id
        LEFT JOIN comment_upvotes_user cuv ON cuv.comment_id = c.id
        LEFT JOIN comment_upvotes_count cuc ON cuc.comment_id = c.id
        LEFT JOIN replies_agg ra ON ra.comment_id = c.id
        ORDER BY c.id;
      `;
      const { rows: comments } = await queryDb(commentsQuery, [
        Number(postId),
        req.body.user.id,
        pageSize ? pageSize : 8,
        pageNumber ? pageNumber : 1
      ]);
      return res.status(200).json({ comments });
    } catch (error) {
      console.error("Error fetching post comments:", error);
      return res.status(500).json({ message: "An error occurred while fetching the comments." });
    }
  }
  async createPost(req, res, next) {
    const { title, content, thumbnail, squad } = req.body;
    if (!title || !content || !thumbnail || !squad) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const { rows: isSquadMember } = await queryDb(
      `SELECT 1 FROM squad_members WHERE squad_id = $1 AND user_id = $2`,
      [Number(squad), Number(req.body.user.id)]
    );
    if (isSquadMember.length < 1) {
      return res.status(403).json({ message: "You are not a member of this squad." });
    }
    const sanitizedContent = sanitizeHtml2(content, {
      allowedTags: [],
      allowedAttributes: {}
    });
    const tags = this.detectTags(sanitizedContent);
    const slug = title.toLowerCase().trim().replace(/[\s\W-]+/g, "-");
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const postQuery = `
      INSERT INTO posts (title, content, thumbnail, author_id, squad_id, slug,tags)
      VALUES ($1, $2, $3, $4, $5, $6,$7)
      RETURNING id;
  `;
      const { rows: postRows } = await client.query(postQuery, [
        title,
        sanitizedContent,
        thumbnail,
        Number(req.body.user.id),
        Number(squad),
        slug,
        tags
      ]);
      const postId = postRows[0].id;
      await client.query(
        `INSERT INTO post_upvotes (post_id, upvotes) VALUES ($1, $2)`,
        [postId, 0]
      );
      await client.query(
        `INSERT INTO post_views (post_id, views) VALUES ($1, $2)`,
        [postId, 0]
      );
      await client.query("COMMIT");
      res.status(201).json({ message: "Post created successfully." });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Transaction failed and rolled back:", error);
      res.status(500).json({ message: "An error occurred while creating the post." });
    } finally {
      client.release();
      console.log("Database client released");
    }
  }
  async editPost(req, res, next) {
    const { postId } = req.params;
    const { title, content } = req.body;
    try {
      if (title || content) {
        const sanitizedContent = sanitizeHtml2(content, {
          allowedTags: [],
          allowedAttributes: {}
        });
        const tags = this.detectTags(sanitizedContent);
        const updatePostQuery = `
          UPDATE posts
          SET title = COALESCE($1, title),
              content = COALESCE($2, content),
              tags = COALESCE($3, tags)
          WHERE id = $4
          RETURNING id;
        `;
        const { rows: updatedRows } = await queryDb(updatePostQuery, [
          title,
          sanitizedContent,
          tags,
          postId
        ]);
        if (updatedRows.length === 0) {
          return res.status(404).json({ message: "Post not found." });
        }
      }
      res.status(200).json({ message: "Post updated successfully." });
    } catch (error) {
      next(error);
    }
  }
  async upvoteComment(req, res, next) {
    const { commentId } = req.params;
    if (!commentId) {
      return res.status(400).json({ message: "Comment ID is required." });
    }
    try {
      const userId = req.body.user.id;
      const { rows } = await queryDb(
        `SELECT 1 FROM comment_upvotes WHERE comment_id = $1 AND user_id = $2`,
        [Number(commentId), userId]
      );
      if (rows.length > 0) {
        await queryDb(
          `DELETE FROM comment_upvotes 
           WHERE comment_id = $1 AND user_id = $2`,
          [Number(commentId), userId]
        );
        return res.status(200).json({ message: "Upvote removed." });
      }
      await queryDb(
        `INSERT INTO comment_upvotes (comment_id, user_id) 
         VALUES ($1, $2)`,
        [Number(commentId), userId]
      );
      return res.status(200).json({ message: "Comment upvoted successfully." });
    } catch (error) {
      console.error("Error upvoting comment:", error);
      return res.status(500).json({ message: "An error occurred while upvoting the comment." });
    }
  }
  async upvotePost(req, res, next) {
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required." });
    }
    try {
      const userId = req.body.user.id;
      const { rows } = await queryDb(
        `SELECT 1 FROM user_upvotes WHERE post_id = $1 AND user_id = $2`,
        [Number(postId), userId]
      );
      if (rows.length > 0) {
        await queryDb(
          `UPDATE post_upvotes 
           SET upvotes = upvotes - 1 
           WHERE post_id = $1 AND upvotes > 0`,
          [Number(postId)]
        );
        await queryDb(
          `DELETE FROM user_upvotes 
           WHERE post_id = $1 AND user_id = $2`,
          [Number(postId), userId]
        );
        return res.status(200).json({ message: "Upvote removed." });
      }
      await queryDb(
        `UPDATE post_upvotes 
         SET upvotes = upvotes + 1 
         WHERE post_id = $1`,
        [Number(postId)]
      );
      await queryDb(
        `INSERT INTO user_upvotes (post_id, user_id) 
         VALUES ($1, $2)`,
        [Number(postId), userId]
      );
      return res.status(200).json({ message: "Post upvoted successfully." });
    } catch (error) {
      console.error("Error upvoting post:", error);
      return res.status(500).json({ message: "An error occurred while upvoting the post." });
    }
  }
  async commentOnPost(req, res, next) {
    const { postId } = req.params;
    const { content } = req.body;
    if (!postId || !content) {
      return res.status(400).json({ message: "Post ID and content are required." });
    }
    try {
      const userId = req.body.user.id;
      const sanitizedContent = sanitizeHtml2(content, {
        allowedTags: [],
        allowedAttributes: {}
      });
      await queryDb(
        `INSERT INTO post_comments (post_id, user_id, content) 
         VALUES ($1, $2, $3)`,
        [Number(postId), userId, sanitizedContent]
      );
      return res.status(201).json({ message: "Comment added successfully." });
    } catch (error) {
      console.error("Error creating comment:", error);
      return res.status(500).json({ message: "An error occurred while adding the comment." });
    }
  }
  async deleteComment(req, res, next) {
    const { commentId } = req.params;
    if (!commentId) {
      return res.status(400).json({ message: "Comment ID is required." });
    }
    try {
      await queryDb(
        `DELETE FROM post_comments WHERE id = $1 AND user_id = $2`,
        [Number(commentId), req.body.user.id]
      );
      return res.status(200).json({ message: "Comment deleted successfully." });
    } catch (error) {
      console.error("Error deleting comment:", error);
      return res.status(500).json({ message: "An error occurred while deleting the comment." });
    }
  }
  async deleteCommentReply(req, res, next) {
    const { commentId, replyId } = req.params;
    if (!commentId || !replyId) {
      return res.status(404).json({ message: "Comment and Reply Id is required" });
    }
    try {
      await queryDb(
        `DELETE FROM comment_replies WHERE id = $1 AND comment_id=$2 AND sender_id = $3`,
        [Number(replyId), Number(commentId), req.body.user.id]
      );
      return res.status(200).json({ message: "Reply deleted successfully." });
    } catch (error) {
      console.error("Error deleting comment:", error);
      return res.status(500).json({ message: "An error occurred while deleting the reply." });
    }
  }
  async updateComment(req, res, next) {
    const { content, commentId } = req.body;
    if (!commentId || !content || content.trim().length === 0) {
      return res.status(400).json({ message: "Comment ID and valid content are required." });
    }
    try {
      const userId = req.body.user.id;
      const sanitizedContent = sanitizeHtml2(content, {
        allowedTags: [],
        allowedAttributes: {}
      });
      const { rowCount } = await queryDb(
        `UPDATE post_comments 
         SET content = $1, updated_at = CURRENT_TIMESTAMP, edited = TRUE 
         WHERE id = $2 AND user_id = $3`,
        [sanitizedContent, Number(commentId), userId]
      );
      if (rowCount === 0) {
        return res.status(404).json({ message: "Comment not found or not authorized to update." });
      }
      return res.status(200).json({ message: "Comment updated successfully." });
    } catch (error) {
      console.error("Error updating comment:", error);
      return res.status(500).json({ message: "An error occurred while updating the comment." });
    }
  }
  async updateReply(req, res, next) {
    const { content, replyId } = req.body;
    if (!replyId || !content || content.trim().length === 0) {
      return res.status(400).json({ message: "Reply ID and valid content are required." });
    }
    try {
      const userId = req.body.user.id;
      const sanitizedContent = sanitizeHtml2(content, {
        allowedTags: [],
        allowedAttributes: {}
      });
      const { rowCount } = await queryDb(
        `UPDATE comment_replies 
         SET content = $1, updated_at = CURRENT_TIMESTAMP, edited = TRUE 
         WHERE id = $2 AND sender_id = $3`,
        [sanitizedContent, Number(replyId), userId]
      );
      if (rowCount === 0) {
        return res.status(404).json({ message: "Reply not found or not authorized to update." });
      }
      return res.status(200).json({ message: "Reply updated successfully." });
    } catch (error) {
      console.error("Error updating reply:", error);
      return res.status(500).json({ message: "An error occurred while updating the reply." });
    }
  }
  async replyToComment(req, res, next) {
    const { commentId } = req.params;
    const { content, receiverId } = req.body;
    if (!commentId || !content || !receiverId) {
      return res.status(400).json({
        message: "Comment ID, content, and receiver ID are required."
      });
    }
    try {
      const senderId = req.body.user.id;
      if (receiverId === senderId) {
        return res.status(404).json({ message: "You can't reply on your own comment" });
      }
      const sanitizedContent = sanitizeHtml2(content, {
        allowedTags: [],
        allowedAttributes: {}
      });
      await queryDb(
        `INSERT INTO comment_replies (comment_id, sender_id, recipient_id, content) 
         VALUES ($1, $2, $3, $4)`,
        [Number(commentId), senderId, Number(receiverId), sanitizedContent]
      );
      return res.status(201).json({ message: "Reply added successfully." });
    } catch (error) {
      console.error("Error replying to comment:", error);
      return res.status(500).json({ message: "An error occurred while adding the reply." });
    }
  }
  async viewPost(req, res, next) {
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required." });
    }
    try {
      const userId = req.body.user.id;
      const { rows } = await queryDb(
        `SELECT 1 FROM user_views WHERE post_id = $1 AND user_id = $2`,
        [Number(postId), userId]
      );
      if (rows.length > 0) {
        return res.status(204).json({});
      }
      await queryDb(
        `UPDATE post_views
         SET views = views + 1 
         WHERE post_id = $1`,
        [Number(postId)]
      );
      await queryDb(
        `INSERT INTO user_views (post_id, user_id) 
         VALUES ($1, $2)`,
        [Number(postId), userId]
      );
      return res.status(200).json({ message: "Post viewed successfully." });
    } catch (error) {
      console.error("Error upvoting post:", error);
      return res.status(500).json({ message: "An error occurred while upvoting the post." });
    }
  }
  async deletePost(req, res, next) {
    const { postId } = req.params;
    try {
      const deletePostQuery = `
        DELETE FROM posts WHERE id = $1 AND author_id = $2 returning id;
      `;
      const { rows } = await queryDb(deletePostQuery, [
        postId,
        req.body.user.id
      ]);
      if (rows.length === 0) {
        return res.status(404).json({ message: "Post not found." });
      }
      res.status(200).json({ message: "Post deleted successfully." });
    } catch (error) {
      next(error);
    }
  }
};
var postController = new PostController();

// src/routes/posts/posts.routes.ts
var router3 = Router3();
router3.use(checkAuth);
router3.get("/", asyncHandler(postController.getPosts));
router3.get("/get-my-posts", asyncHandler(postController.getMyPosts));
router3.get("/get-user-posts", asyncHandler(postController.getUserPosts));
router3.get("/post-by-slug", asyncHandler(postController.getPostBySlug));
router3.get(
  "/get-post-comments/:postId",
  asyncHandler(postController.getPostComments)
);
router3.post("/create", asyncHandler(postController.createPost));
router3.post("/comment/:postId", asyncHandler(postController.commentOnPost));
router3.post("/reply/:commentId", asyncHandler(postController.replyToComment));
router3.put("/update-comment", asyncHandler(postController.updateComment));
router3.put("/update-reply", asyncHandler(postController.updateReply));
router3.put(
  "/upvote-comment/:commentId",
  asyncHandler(postController.upvoteComment)
);
router3.put("/:postId", asyncHandler(postController.editPost));
router3.put("/upvote/:postId", asyncHandler(postController.upvotePost));
router3.put("/view/:postId", asyncHandler(postController.viewPost));
router3.delete(
  "/delete-comment/:commentId",
  asyncHandler(postController.deleteComment)
);
router3.delete(
  "/delete-reply/:commentId/:replyId",
  asyncHandler(postController.deleteCommentReply)
);
router3.delete("/delete-post/:postId", asyncHandler(postController.deletePost));

// src/routes/squads/squad.routes.ts
import { Router as Router4 } from "express";

// src/routes/squads/squads.controller.ts
var squadCategories = [
  "frontend",
  "backend",
  "full-stack",
  "devops",
  "data-science",
  "AI",
  "mobile",
  "cloud",
  "security",
  "quality-assurance",
  "general"
];
var SquadController = class {
  constructor() {
    this.getSquads = this.getSquads.bind(this);
    this.getSquadMembers = this.getSquadMembers.bind(this);
    this.createSquad = this.createSquad.bind(this);
    this.squadDetails = this.squadDetails.bind(this);
    this.getSquadPosts = this.getSquadPosts.bind(this);
    this.joinSquad = this.joinSquad.bind(this);
    this.leaveSquad = this.leaveSquad.bind(this);
    this.updateSquad = this.updateSquad.bind(this);
    this.deleteSquad = this.deleteSquad.bind(this);
    this.makeAdmin = this.makeAdmin.bind(this);
    this.makeModerator = this.makeModerator.bind(this);
    this.makeMember = this.makeMember.bind(this);
    this.removeMember = this.removeMember.bind(this);
  }
  async getSquads(req, res, next) {
    try {
      const query = `
        SELECT s.id, s.name, s.created_at, 
               json_agg(sm.user_id) AS members
        FROM squads s
        LEFT JOIN squad_members sm ON s.id = sm.squad_id
        GROUP BY s.id
      `;
      const { rows } = await queryDb(query);
      res.status(200).json({ squads: rows });
    } catch (error) {
      next(error);
    }
  }
  async getSquadMembers(req, res, next) {
    try {
      const query = `
        SELECT sm.squad_id, sm.user_id, u.name AS user_name
        FROM squad_members sm
        JOIN users u ON sm.user_id = u.id
      `;
      const { rows } = await queryDb(query);
      res.status(200).json({ members: rows });
    } catch (error) {
      next(error);
    }
  }
  async createSquad(req, res, next) {
    const {
      name,
      squad_handle,
      description,
      category,
      is_public,
      post_creation_allowed_to,
      invitation_permission,
      post_approval_required
    } = req.body;
    if (!name || !squad_handle) {
      return res.status(400).json({
        message: "Name, squad handle are required."
      });
    }
    if (!squadCategories.includes(category)) {
      return res.status(400).json({
        message: "Invalid category"
      });
    }
    try {
      const insertSquadQuery = `
        INSERT INTO squads (
          name, squad_handle, description, category, is_public, admin_id,
          post_creation_allowed_to, invitation_permission, post_approval_required
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9
        ) returning id
      `;
      const { rows } = await queryDb(insertSquadQuery, [
        name,
        squad_handle.trim().split(" ").join(""),
        description || "",
        category || "general",
        is_public !== void 0 ? is_public : true,
        req.body.user.id,
        post_creation_allowed_to || "members",
        invitation_permission || "members",
        post_approval_required || false
      ]);
      await queryDb(
        `
            insert into squad_members (squad_id,user_id,role) values ($1,$2,$3)
        `,
        [rows[0].id, req.body.user.id, "admin"]
      );
      res.status(201).json({
        message: "Squad created successfully."
      });
    } catch (error) {
      next(error);
    }
  }
  async getSquadPosts(req, res, next) {
    const { pageSize, cursor } = req.query;
    const { squad_id } = req.params;
    try {
      const query = `
        WITH paginated_posts AS (
            SELECT id
            FROM posts
            where id > $1 and squad_id=$2
            ORDER BY id ASC
            LIMIT $3
        )
        SELECT 
            p.id as post_id,
            p.title as post_title,
            p.tags as post_tags,
            p.thumbnail as post_thumbnail,
            p.created_at as post_created_at,
            p_v.upvotes AS post_upvotes,
            p_vw.views AS post_views,
            u.avatar as author_avatar
        FROM paginated_posts pp
        JOIN posts p ON pp.id = p.id
        JOIN post_upvotes p_v ON p.id = p_v.post_id
        JOIN post_views p_vw ON p.id = p_vw.post_id
        JOIN users u ON p.author_id = u.id
        ORDER BY p.id;
    `;
      const { rows } = await queryDb(query, [
        cursor,
        Number(squad_id),
        pageSize ? pageSize : 1
      ]);
      return res.status(200).json({ posts: rows });
    } catch (error) {
      next(error);
    }
  }
  async squadDetails(req, res, next) {
    const { squad_handle } = req.params;
    const userId = req.body.user.id;
    if (!squad_handle) {
      return res.status(400).json({ message: "Squad handle is required." });
    }
    const query = `
        WITH selected_squad AS (
            SELECT 
                squads.id AS squad_id,
                squads.name AS squad_name,
                squads.squad_handle,
                squads.description,
                squads.thumbnail,
                squads.category,
                squads.is_public,
                squads.admin_id,
                squads.post_creation_allowed_to,
                squads.invitation_permission,
                squads.post_approval_required,
                squads.created_at
            FROM squads 
            WHERE squads.squad_handle = $1
        ),
        filtered_squad_members AS (
            SELECT 
                squad_members.role,
                squad_members.user_id
            FROM squad_members
            WHERE squad_members.squad_id = (SELECT squad_id FROM selected_squad)
        )
        SELECT 
            s.*,
            (
                SELECT JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'post_id', posts.id,
                        'post_upvotes', COALESCE(post_upvotes.upvotes, 0),
                        'post_views', COALESCE(post_views.views, 0)
                    )
                )
                FROM posts
                LEFT JOIN post_upvotes ON posts.id = post_upvotes.post_id
                LEFT JOIN post_views ON posts.id = post_views.post_id
                WHERE posts.squad_id = s.squad_id
            ) AS squad_posts_metadata,
            (
                SELECT JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'role', fsm.role,
                        'userDetails', JSON_BUILD_OBJECT(
                            'userId', users.id,
                            'name', users.name,
                            'username', users.username,
                            'email', users.email,
                            'avatar', users.avatar,
                            'profession', users.profession,
                            'current_user_follow', EXISTS(
                                SELECT 1 
                                FROM followers 
                                WHERE follower_id = $2 AND followed_id = users.id
                            )
                        )
                    )
                )
                FROM filtered_squad_members fsm
                INNER JOIN users ON fsm.user_id = users.id
            ) AS squad_members
        FROM selected_squad s;
    `;
    const { rows } = await queryDb(query, [squad_handle, userId]);
    return res.status(200).json(rows[0]);
  }
  async mySquads(req, res, next) {
    const query = `
          SELECT 
            id,
            name as squad_name,
            squad_handle,
            description,
            category,
            is_public,
            created_at
          FROM squads 
          WHERE admin_id = $1
  `;
    try {
      const { rows } = await queryDb(query, [req.body.user.id]);
      res.status(200).json(rows);
    } catch (error) {
      next(error);
    }
  }
  async joinSquad(req, res, next) {
    const { squad_handle, squad_id } = req.body;
    if (!squad_handle || !squad_id) {
      return res.status(400).json({ message: "Squad handle and ID are required." });
    }
    const query = `
      WITH check_user AS (
        SELECT id
        FROM squad_members
        WHERE squad_id = $1 AND user_id = $2
      )
      INSERT INTO squad_members (squad_id, user_id)
      SELECT $1, $2
      WHERE NOT EXISTS (SELECT 1 FROM check_user)
      RETURNING id;
    `;
    try {
      const { rows } = await queryDb(query, [squad_id, req.body.user.id]);
      if (rows.length === 0) {
        return res.status(400).json({ message: "You already joined the squad" });
      }
      res.status(201).json({ message: "Successfully joined the squad" });
    } catch (error) {
      next(error);
    }
  }
  async leaveSquad(req, res, next) {
    const { squad_id } = req.body;
    if (!squad_id) {
      return res.status(400).json({ message: "Squad ID is required." });
    }
    const userId = req.body.user.id;
    const query = `
      DELETE FROM squad_members
      WHERE squad_id = $1 AND user_id = $2
      RETURNING id;
    `;
    try {
      const { rows } = await queryDb(query, [squad_id, userId]);
      if (rows.length === 0) {
        return res.status(400).json({ message: "You are not a member of this squad." });
      }
      res.status(200).json({ message: "Successfully left the squad" });
    } catch (error) {
      next(error);
    }
  }
  async updateSquad(req, res, next) {
    const { squad_handle, squad_id } = req.params;
    if (!squad_handle) {
      return res.status(400).json({ message: "Squad handle is required." });
    }
    const {
      name,
      squad_handle: new_squad_handle,
      description,
      category,
      is_public,
      post_creation_allowed_to,
      invitation_permission,
      post_approval_required,
      thumbnail
    } = req.body;
    try {
      const query = `
        UPDATE squads
        SET 
          name = $1,
          squad_handle = $2,
          description = $3,
          category = $4,
          is_public = $5,
          post_creation_allowed_to = $6,
          invitation_permission = $7,
          post_approval_required = $8,
          thumbnail = $9
        WHERE squad_handle = $10 and id = $11
        RETURNING squad_handle;
      `;
      const { rows } = await queryDb(query, [
        name,
        new_squad_handle,
        description,
        category,
        is_public,
        post_creation_allowed_to,
        invitation_permission,
        post_approval_required,
        thumbnail,
        squad_handle,
        squad_id
      ]);
      if (rows.length === 0) {
        return res.status(404).json({ message: "Squad not found." });
      }
      res.status(200).json({ message: "Squad updated successfully." });
    } catch (error) {
      next(error);
    }
  }
  async deleteSquad(req, res, next) {
    const { squad_id } = req.params;
    try {
      const query = `
        DELETE FROM squads WHERE  id = $1 RETURNING id;
      `;
      const { rows } = await queryDb(query, [Number(squad_id)]);
      if (rows.length === 0) {
        return res.status(404).json({ message: "Squad not found." });
      }
      res.status(200).json({ message: "Squad deleted successfully." });
    } catch (error) {
      next(error);
    }
  }
  async makeAdmin(req, res, next) {
    const { squad_id } = req.params;
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({ message: "User id is required." });
    }
    try {
      const query = `
        UPDATE squad_members 
        SET role = 'admin' 
        WHERE squad_id = $1 AND user_id = $2 
        RETURNING role;
      `;
      const { rows } = await queryDb(query, [
        Number(squad_id),
        Number(user_id)
      ]);
      if (rows.length === 0) {
        return res.status(404).json({ message: "User not found or update failed." });
      }
      res.status(200).json({ message: `User role updated to ${rows[0].role}.` });
    } catch (error) {
      next(error);
    }
  }
  async makeModerator(req, res, next) {
    const { squad_id } = req.params;
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({ message: "User id is required." });
    }
    try {
      const query = `
        UPDATE squad_members 
        SET role = 'moderator' 
        WHERE squad_id = $1 AND user_id = $2 
        RETURNING role;
      `;
      const { rows } = await queryDb(query, [
        Number(squad_id),
        Number(user_id)
      ]);
      if (rows.length === 0) {
        return res.status(404).json({ message: "User not found or update failed." });
      }
      res.status(200).json({ message: `User role updated to ${rows[0].role}.` });
    } catch (error) {
      next(error);
    }
  }
  async makeMember(req, res, next) {
    const { squad_id } = req.params;
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({ message: "User id is required." });
    }
    try {
      const query = `
        UPDATE squad_members 
        SET role = 'member' 
        WHERE squad_id = $1 AND user_id = $2 
        RETURNING role;
      `;
      const { rows } = await queryDb(query, [
        Number(squad_id),
        Number(user_id)
      ]);
      if (rows.length === 0) {
        return res.status(404).json({ message: "User not found or update failed." });
      }
      res.status(200).json({ message: `User role updated to ${rows[0].role}.` });
    } catch (error) {
      next(error);
    }
  }
  async removeMember(req, res, next) {
    const { squad_id } = req.params;
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({ message: "User id is required." });
    }
    try {
      const query = `
        delete from  squad_members 
        WHERE squad_id = $1 AND user_id = $2 
        RETURNING role;
      `;
      const { rows } = await queryDb(query, [
        Number(squad_id),
        Number(user_id)
      ]);
      if (rows.length === 0) {
        return res.status(404).json({ message: "User not found or update failed." });
      }
      res.status(200).json({ message: `Remove Member successfully` });
    } catch (error) {
      next(error);
    }
  }
};
var squadController = new SquadController();

// src/routes/squads/squads.middleware.ts
async function isSquadAdmin(req, res, next) {
  const user = req.body.user;
  const { squad_id } = req.params;
  if (!squad_id) {
    return res.status(400).json({ message: "Squad ID is required." });
  }
  const { rows } = await queryDb(
    `SELECT 1 from squad_members where squad_id =$1 and user_id = $2 and role=$3`,
    [Number(squad_id), user.id, "admin"]
  );
  if (rows.length < 1) {
    return res.status(403).json({ message: "You are not an admin of this squad." });
  }
  next();
}

// src/routes/squads/squad.routes.ts
var router4 = Router4();
router4.use(checkAuth);
router4.post("/create", asyncHandler(squadController.createSquad));
router4.get("/my", asyncHandler(squadController.mySquads));
router4.get(
  "/details/:squad_handle",
  asyncHandler(squadController.squadDetails)
);
router4.get("/posts/:squad_id", asyncHandler(squadController.getSquadPosts));
router4.get("/", asyncHandler(squadController.getSquads));
router4.put("/join", asyncHandler(squadController.joinSquad));
router4.put("/leave", asyncHandler(squadController.leaveSquad));
router4.put(
  "/edit/:squad_id/:squad_handle",
  isSquadAdmin,
  asyncHandler(squadController.updateSquad)
);
router4.put(
  "/:squad_id/make-admin",
  isSquadAdmin,
  asyncHandler(squadController.makeAdmin)
);
router4.put(
  "/:squad_id/make-moderator",
  isSquadAdmin,
  asyncHandler(squadController.makeModerator)
);
router4.put(
  "/:squad_id/make-member",
  isSquadAdmin,
  asyncHandler(squadController.makeMember)
);
router4.put(
  "/:squad_id/remove-member",
  isSquadAdmin,
  asyncHandler(squadController.removeMember)
);
router4.delete(
  "/:squad_id",
  isSquadAdmin,
  asyncHandler(squadController.deleteSquad)
);

// src/routes/followers/followers.routes.ts
import { Router as Router5 } from "express";

// src/routes/followers/followers.controller.ts
var FollowersController = class {
  constructor() {
    this.followUser = this.followUser.bind(this);
    this.getFollowers = this.getFollowers.bind(this);
    this.getUserFollowers = this.getUserFollowers.bind(this);
    this.getFollowing = this.getFollowing.bind(this);
    this.getUserFollowing = this.getUserFollowing.bind(this);
    this.getFollowingsPosts = this.getFollowingsPosts.bind(this);
    this.getNotifications = this.getNotifications.bind(this);
    this.unfollowUser = this.unfollowUser.bind(this);
    this.updateNotificationStatus = this.updateNotificationStatus.bind(this);
  }
  async followUser(req, res, next) {
    try {
      const { followedId } = req.body;
      let { followerId } = req.body;
      if (!followedId || isNaN(followedId)) {
        return res.status(400).json({ message: "Valid followedId is required." });
      }
      followerId = Number(followerId);
      if (followerId === Number(followedId)) {
        return res.status(400).json({ message: "Users cannot follow themselves." });
      }
      const { rows: existingFollow } = await queryDb(
        "SELECT 1 FROM followers WHERE follower_id = $1 AND followed_id = $2",
        [followerId, Number(followedId)]
      );
      if (existingFollow.length > 0) {
        return res.status(400).json({ message: "Already following this user." });
      }
      await runIndependentTransaction([
        {
          query: "INSERT INTO followers (follower_id, followed_id) VALUES ($1, $2)",
          params: [followerId, Number(followedId)]
        },
        {
          query: "UPDATE user_stats SET following = following + 1 WHERE user_id = $1",
          params: [followerId]
        },
        {
          query: "UPDATE user_stats SET followers = followers + 1 WHERE user_id = $1",
          params: [Number(followedId)]
        },
        {
          query: "INSERT INTO follow_notifications (user_id, actor_id, action_type) VALUES ($1, $2, $3)",
          params: [Number(followedId), followerId, "follow"]
        }
      ]);
      res.status(201).json({ message: "User followed successfully." });
    } catch (error) {
      console.log(error.message);
      if (error.constraint === "followers_follower_id_fkey") {
        return res.status(400).json({ message: "Follower does not exist." });
      }
      if (error.code === "23503") {
        console.error(
          "Foreign key violation: The followed user does not exist."
        );
        res.status(400).json({
          message: "The followed user does not exist."
        });
      }
      next(error);
    }
  }
  async unfollowUser(req, res, next) {
    try {
      const { followedId } = req.body;
      if (!followedId || isNaN(followedId)) {
        return res.status(400).json({ message: "Valid followedId is required." });
      }
      const followerId = Number(req.body.user.id);
      if (followerId === Number(followedId)) {
        return res.status(400).json({ message: "Users cannot follow and unfollow themselves." });
      }
      const { rows: existingFollow } = await queryDb(
        "SELECT 1 FROM followers WHERE follower_id = $1 AND followed_id = $2",
        [followerId, Number(followedId)]
      );
      if (existingFollow.length < 1) {
        return res.status(400).json({ message: "You doesn't follow this user" });
      }
      await runIndependentTransaction([
        {
          query: "DELETE FROM followers WHERE follower_id =$1 AND followed_id=$2",
          params: [followerId, Number(followedId)]
        },
        {
          query: "UPDATE user_stats SET following = following - 1 WHERE user_id = $1",
          params: [followerId]
        },
        {
          query: "UPDATE user_stats SET followers = followers - 1 WHERE user_id = $1",
          params: [Number(followedId)]
        },
        {
          query: "DELETE FROM follow_notifications WHERE user_id = $1 AND actor_id = $2",
          params: [Number(followedId), followerId]
        }
      ]);
      res.status(201).json({ message: "User un-followed successfully." });
    } catch (error) {
      if (error.code === "23503") {
        return res.status(400).json({
          message: "The user you're trying to unfollow does not exist."
        });
      }
      next(error);
    }
  }
  async getUserFollowers(req, res, next) {
    try {
      const { userId } = req.query;
      if (!userId || isNaN(userId)) {
        return res.status(400).json({ message: "User ID is required." });
      }
      const { rows: followers } = await queryDb(
        `
       WITH user_followers AS (
            SELECT 
                follower_id, 
                followed_id
            FROM followers
            WHERE followed_id = $1
        )
          SELECT 
              u.id, 
              u.username, 
              u.name, 
              u.avatar,
              EXISTS (
                  SELECT 1 
                  FROM followers f_f
                  WHERE f_f.follower_id = $2 
                    AND f_f.followed_id = uf.follower_id
              ) AS current_user_follow
          FROM user_followers uf
          INNER JOIN users u 
              ON u.id = uf.follower_id;
        `,
        [Number(userId), req.body.user.id]
      );
      res.status(200).json(followers);
    } catch (error) {
      next(error);
    }
  }
  async getFollowers(req, res, next) {
    try {
      const userId = req.body.user.id;
      const { rows: followers } = await queryDb(
        `
       WITH user_followers AS (
            SELECT 
                follower_id, 
                followed_id
            FROM followers
            WHERE followed_id = $1
        )
          SELECT 
              u.id, 
              u.username, 
              u.name, 
              u.avatar,
              EXISTS (
                  SELECT 1 
                  FROM followers f_f
                  WHERE f_f.follower_id = $1 
                    AND f_f.followed_id = uf.follower_id
              ) AS current_user_follow
          FROM user_followers uf
          INNER JOIN users u 
              ON u.id = uf.follower_id;

        `,
        [userId]
      );
      res.status(200).json(followers);
    } catch (error) {
      next(error);
    }
  }
  async getFollowingsPosts(req, res, next) {
    try {
      const userId = req.body.user.id;
      const { pageSize, lastId } = req.query;
      const { rows: followingsPosts } = await queryDb(
        `
         WITH user_followings AS (
              SELECT 
                  follower_id, 
                  followed_id
              FROM followers
              WHERE follower_id = $1
          ),
          user_followings_posts AS (
              SELECT 
                  p.id,
                  p.title,
                  p.thumbnail,
                  p.slug,
                  p.created_at,
                  p.squad_id,
                  p.tags,
                  p.author_id
              FROM posts p
              INNER JOIN user_followings u_f ON p.author_id = u_f.followed_id
              where p.id > $3
              ORDER BY p.id asc
              LIMIT $2
          )
          SELECT 
              p.id,
              p.title,
              p.thumbnail,
              p.tags,
              p.slug,
              p.created_at,
              p_v.upvotes AS upvotes,
              p_vw.views AS views,
              JSON_BUILD_OBJECT(
                  'squad_thumbnail', p_sq.thumbnail,
                  'squad_handle', p_sq.squad_handle
              ) AS squad_details,
              JSON_BUILD_OBJECT(
                  'author_avatar', u.avatar,
                  'author_name', u.name,
                  'author_username', u.username,
                  'author_id', u.id
              ) AS author_details,
              EXISTS (
                  SELECT 1 
                  FROM user_upvotes u_u_v 
                  WHERE u_u_v.user_id = $1 
                    AND u_u_v.post_id = p.id
              ) AS current_user_upvoted
          FROM user_followings_posts p
          INNER JOIN post_upvotes p_v 
              ON p.id = p_v.post_id
          INNER JOIN post_views p_vw 
              ON p.id = p_vw.post_id
          INNER JOIN squads p_sq 
              ON p.squad_id = p_sq.id
          INNER JOIN users u 
              ON p.author_id = u.id;
        `,
        [userId, pageSize ? Number(pageSize) : 8, lastId ? Number(lastId) : 0]
      );
      res.status(200).json({ posts: followingsPosts });
    } catch (error) {
      next(error);
    }
  }
  async getUserFollowing(req, res, next) {
    try {
      const { userId } = req.query;
      if (!userId || isNaN(userId)) {
        return res.status(400).json({ message: "User ID is required." });
      }
      const { rows: followings } = await queryDb(
        `
          WITH user_followings AS (
            SELECT follower_id, followed_id
            FROM followers
            WHERE follower_id = $1
          )
          SELECT u.id, u.username, u.name, u.avatar,
           EXISTS (
                  SELECT 1 
                  FROM followers f_f
                  WHERE f_f.follower_id = $2 
                    AND f_f.followed_id = uf.followed_id
              ) AS current_user_follow
          FROM user_followings uf
          INNER JOIN users u ON u.id = uf.followed_id
        `,
        [Number(userId), req.body.user.id]
      );
      res.status(200).json(followings);
    } catch (error) {
      next(error);
    }
  }
  async getFollowing(req, res, next) {
    try {
      const userId = req.body.user.id;
      const { rows: followings } = await queryDb(
        `
          WITH user_followings AS (
            SELECT follower_id, followed_id
            FROM followers
            WHERE follower_id = $1
          )
          SELECT u.id, u.username, u.name, u.avatar
          FROM user_followings uf
          INNER JOIN users u ON u.id = uf.followed_id
        `,
        [userId]
      );
      res.status(200).json(followings);
    } catch (error) {
      next(error);
    }
  }
  async updateNotificationStatus(req, res, next) {
    try {
      const userId = req.body.user.id;
      const query = `
        UPDATE follow_notifications
        SET is_read = True
        WHERE  user_id = $1
        RETURNING id;
      `;
      const { rows } = await queryDb(query, [userId]);
      if (rows.length === 0) {
        return res.status(404).json({
          message: "Notification not found or does not belong to the user."
        });
      }
      return res.status(200).json({
        message: "Notification status updated successfully."
      });
    } catch (error) {
      next(error);
    }
  }
  async getNotifications(req, res, next) {
    try {
      const userId = req.body.user.id;
      const { rows: notifications } = await queryDb(
        `
        WITH user_notifications AS (
            SELECT * 
            FROM follow_notifications f_n
            WHERE f_n.user_id = $1
        )
          SELECT
              n.*,
              JSON_BUILD_OBJECT(
                  'username', u.username,
                  'avatar', u.avatar,
                  'name', u.name
              ) AS actor_details
          FROM user_notifications n
          INNER JOIN users u ON u.id = n.actor_id;

        `,
        [userId]
      );
      res.status(200).json(notifications);
    } catch (error) {
      next(error);
    }
  }
};
var followersController = new FollowersController();

// src/routes/followers/followers.routes.ts
var router5 = Router5();
router5.use(checkAuth);
router5.put("/follow", asyncHandler(followersController.followUser));
router5.put("/unfollow", asyncHandler(followersController.unfollowUser));
router5.get("/my-followers", asyncHandler(followersController.getFollowers));
router5.get(
  "/user-followers",
  asyncHandler(followersController.getUserFollowers)
);
router5.get("/my-followings", asyncHandler(followersController.getFollowing));
router5.get(
  "/user-followings",
  asyncHandler(followersController.getUserFollowing)
);
router5.get(
  "/followings-posts",
  asyncHandler(followersController.getFollowingsPosts)
);
router5.get(
  "/notifications",
  asyncHandler(followersController.getNotifications)
);
router5.put(
  "/read-notifications",
  asyncHandler(followersController.updateNotificationStatus)
);

// src/server.ts
var logger = pino({ name: "server start" });
var app = express3();
app.set("trust proxy", true);
app.use(cookieParser());
app.use(express3.json());
app.use(express3.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://daily-dev-client.vercel.app"],
    credentials: true,
    exposedHeaders: ["Set-Cookie"]
  })
);
app.use(helmet());
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport2.initialize());
app.use(passport2.session());
passport2.use(
  new GitHubStrategy(
    {
      clientID: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      callbackURL: "https://dailydev-backend.vercel.app/auth/github/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        id: profile.id.toString(),
        username: profile.username || "",
        name: profile.displayName || "",
        email: profile.emails?.map((email) => email.value)[0],
        avatar: profile.photos ? profile.photos[0].value : ""
      };
      return done(null, user);
    }
  )
);
passport2.serializeUser((user, done) => {
  done(null, user);
});
passport2.deserializeUser(
  (user, done) => {
    done(null, user);
  }
);
app.use(requestLogger_default);
app.use("/auth", router);
app.use("/profile", router2);
app.use("/posts", router3);
app.use("/squad", router4);
app.use("/follower", router5);
app.use(openAPIRouter);
app.use(errorHandler_default());
app.use(reqErrorHandler);

// src/index.ts
var server = app.listen(env.PORT, () => {
  const { NODE_ENV, HOST, PORT } = env;
  logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
});
var onCloseSignal = () => {
  logger.info("sigint received, shutting down");
  server.close(() => {
    logger.info("server closed");
    process.exit();
  });
  setTimeout(() => process.exit(1), 1e4).unref();
};
process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);
//# sourceMappingURL=index.mjs.map