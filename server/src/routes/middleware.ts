import { env } from "@/common/utils/envConfig";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function checkAuth(req: Request, res: Response, next: NextFunction) {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next({
        message: "Authentication required",
        status: 401,
      });
    }

    const user = jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET);

    if (req.body === undefined) {
      req.body = {};
    }

    req.body.user = user;
    next();
  } catch (error) {
    return next({
      message: "Invalid or expired access token",
      status: 401,
    });
  }
}
