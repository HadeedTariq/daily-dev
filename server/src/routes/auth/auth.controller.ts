import { db } from "@/server";
import { NextFunction, Request, Response } from "express";
import { DatabaseError } from "pg";

class UserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    const { name, username, profession, email } = req.body;
    if (!username || !name || !profession || !email) {
      return next({ message: "Please fill all the fields", status: 404 });
    }
    try {
      await db.query(
        `insert into users (name,username,profession) values ($1,$2,$3)`,
        [name, username, profession]
      );
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      if (error instanceof DatabaseError) {
        return next({ status: 404, message: "Please fill all the fields" });
      }
      next(error);
    }
  }
}

export const userController = new UserController();
