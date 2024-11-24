import { db } from "@/server";
import { NextFunction, Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { DatabaseError } from "pg";
import { createCipheriv } from "crypto";
import { env } from "@/common/utils/envConfig";
import nodeMailer from "nodemailer";

class UserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    const { token } = req.query;
    // TODO  make functionality later
    if (!token) {
      return next({ message: "Token is required", status: 404 });
    }
    try {
      // await db.query(
      //   `insert into users (name,username,profession) values ($1,$2,$3)`,
      //   [name, username, profession]
      // );
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      if (error instanceof DatabaseError) {
        return next({ status: 404, message: "Please fill all the fields" });
      }
      next(error);
    }
  }

  private encryptToken(token: string): string {
    const key = Buffer.from("123456", "base64");
    const algorithm = "aes-256-cbc";
    const initVector = Buffer.from("abcdef", "base64");
    const cipher = createCipheriv(algorithm, key, initVector);

    return cipher.update(token, "utf8", "hex") + cipher.final("hex");
  }

  private async sendMail(email: string, magicLink: string) {
    try {
      let transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
          user: env.NODE_MAILER_USER,
          pass: env.NODE_MAILER_PASSWORD,
        },
      });
      const info = await transporter.sendMail({
        from: "hadeedtariq12@gmail.com",
        to: email,
        subject: "Verification email",
        html: `
        <h1></h1>Please verify your registeration on daily dev by clicking the verification link below:</h1>
        <a href="${magicLink}">${magicLink}</a>
        `,
      });
      return { info };
    } catch (err) {
      return { error: err };
    }
  }

  async registerUser(req: Request, res: Response, next: NextFunction) {
    const { name, username, profession, email } = req.body;
    if (!username || !name || !profession || !email) {
      return next({ message: "Please fill all the fields", status: 404 });
    }
    const user = await db.query("select email from users where email=$1", [
      email,
    ]);
    if (user.rowCount && user.rowCount > 0) {
      return next({ message: "User already exist", status: 404 });
    }
    const expiresIn = "1d";
    const secret = "qwerty";
    const dataStoredInToken = {
      name,
      username,
      profession,
      email,
    };

    const signedToken = sign(dataStoredInToken, secret, { expiresIn });
    const token = this.encryptToken(signedToken);
    const magicLink = `${env.SERVER_DOMAIN}/auth/register?token=${token}`;
    await db.query(
      "INSERT INTO magicLinks (email,token) VALUES ($1,$2),[email,token]"
    );
    const { error } = await this.sendMail(email, magicLink);
    console.log(error);

    if (error) {
      return next({
        message: "Failed to send verification email",
        status: 500,
      });
    }
    return res
      .status(200)
      .json({ message: "Verification email sent successfully" });
  }
}

export const userController = new UserController();
