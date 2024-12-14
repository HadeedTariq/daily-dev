import { db } from "@/server";
import { NextFunction, Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { DatabaseError } from "pg";
import { createCipheriv, createDecipheriv } from "crypto";
import { env } from "@/common/utils/envConfig";
import nodeMailer from "nodemailer";
import { hash } from "bcrypt";

class UserController {
  constructor() {
    this.registerUser = this.registerUser.bind(this);
    this.createUser = this.createUser.bind(this);
  }
  async createUser(req: Request, res: Response, next: NextFunction) {
    const { token } = req.query;

    if (!token) {
      return next({ message: "Token is required", status: 404 });
    }
    try {
      const { rows } = await db.query(
        `select email from  magicLinks where token =$1`,
        [token]
      );
      if (rows.length < 1) {
        return next({ status: 404, message: "Invalid token" });
      }

      const decryptedToken = this.decryptToken(token as string);

      const user: any = verify(decryptedToken, env.JWT_SECRET);

      if (user.email !== rows[0].email) {
        return next({ status: 404, message: "Incorrect Token" });
      }

      await db.query(`update users set is_verified=$1 where email=$2`, [
        true,
        user.email,
      ]);

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      if (error instanceof DatabaseError) {
        return next({ status: 404, message: "Please fill all the fields" });
      }
      next(error);
    }
  }

  encryptToken = (token: string): string => {
    const key = Buffer.from("12345678901234567890123456789012"); // 32-byte key
    const algorithm = "aes-256-cbc";
    const initVector = Buffer.from("1234567890abcdef"); // Direct raw string (16 bytes)
    const cipher = createCipheriv(algorithm, key, initVector);
    return cipher.update(token, "utf8", "hex") + cipher.final("hex");
  };

  decryptToken = (token: string): string => {
    const key = Buffer.from("12345678901234567890123456789012"); // 32-byte key
    const algorithm = "aes-256-cbc";
    const initVector = Buffer.from("1234567890abcdef"); // Direct raw string (16 bytes)
    const decipher = createDecipheriv(algorithm, key, initVector);
    return decipher.update(token, "hex", "utf8") + decipher.final("utf8");
  };

  hashPassword = async (password: string): Promise<string> => {
    const hashPassword = await hash(password, 10);
    return hashPassword;
  };

  sendMail = async (email: string, magicLink: string) => {
    try {
      let transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
          user: String(env.NODE_MAILER_USER),
          pass: String(env.NODE_MAILER_PASSWORD),
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
      console.log(err);

      return { error: err };
    }
  };

  async registerUser(req: Request, res: Response, next: NextFunction) {
    const { name, username, profession, email, password } = req.body;
    if (!username || !name || !profession || !email || !password) {
      return next({ message: "Please fill all the fields", status: 404 });
    }
    const user = await db.query(`select email from users where email=$1`, [
      email,
    ]);
    if (user.rowCount && user.rowCount > 0) {
      return next({ message: "User already exist", status: 404 });
    }
    const expiresIn = "1d";
    const dataStoredInToken = {
      name,
      username,
      profession,
      email,
    };

    const signedToken = sign(dataStoredInToken, env.JWT_SECRET, { expiresIn });
    const token = this.encryptToken(signedToken);

    const magicLink = `${env.SERVER_DOMAIN}/auth/register?token=${token}`;

    await db.query(`INSERT INTO  magicLinks (email,token) VALUES ($1,$2)`, [
      email,
      token,
    ]);

    const hashPassword = this.hashPassword(password);
    await db.query(
      "INSERT INTO users (email,name,username,profession,user_password) VALUES ($1,$2,$3,$4,$5)",
      [name, username, profession, email, hashPassword]
    );
    const { error } = await this.sendMail(email, magicLink);

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
