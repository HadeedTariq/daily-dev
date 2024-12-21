import { env } from "@/common/utils/envConfig";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return next({
        message: "Access Token not found",
        status: 404,
      });
    }

    const user = jwt.verify(accessToken, env.JWT_ACCESS_TOKEN_SECRET);

    if (!user) {
      return next({
        message: "Invalid Access Token",
        status: 404,
      });
    }

    req.body.user = user;
    next();
  } catch (error) {
    return next({
      message:
        error instanceof jwt.JsonWebTokenError
          ? "Invalid or Expired Access Token"
          : "Authentication Error",
      status: 401,
    });
  }
}
