import { db } from "@/server";
import { NextFunction, Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { DatabaseError } from "pg";
import { createCipheriv, createDecipheriv } from "crypto";
import { env } from "@/common/utils/envConfig";
import nodeMailer from "nodemailer";
import { hash, compare } from "bcrypt";

class UserController {
  constructor() {
    this.registerUser = this.registerUser.bind(this);
    this.createUser = this.createUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.authenticate_github = this.authenticate_github.bind(this);
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

  async loginUser(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    if (!email || !password) {
      return next({ status: 404, message: "Please fill all the fields" });
    }
    const { rows } = await db.query(
      `SELECT * from users where email = $1 and is_verified = $2`,
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

    await db.query("update users set refresh_token = $1 where email = $2", [
      refreshToken,
      email,
    ]);

    res
      .cookie("accessToken", accessToken, {
        secure: true,
        httpOnly: false,
        sameSite: "none",
      })
      .cookie("refreshToken", refreshToken, {
        secure: true,
        httpOnly: false,
        sameSite: "none",
      });

    res.status(200).json({ message: "User logged in successfully" });
  }

  async registerUser(req: Request, res: Response, next: NextFunction) {
    const { name, username, profession, email, password } = req.body;
    if (!username || !name || !profession || !email || !password) {
      return next({ message: "Please fill all the fields", status: 404 });
    }
    const user = await db.query(`select email from users where email=$1`, [
      email,
    ]);
    // await db.query(`delete from users where email=$1`, [email]);
    // await db.query(`delete from magiclinks where email=$1`, [email]);
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

    const hashPassword = await this.hashPassword(password);
    await db.query(
      "INSERT INTO users ( name, username, profession, email,user_password) VALUES ($1,$2,$3,$4,$5)",
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

  async authenticate_github(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;
    if (!user?.email) {
      return next({
        message:
          "We couldn’t retrieve your email from GitHub. To continue, please make your email public or provide an alternative email address in github",
        status: 404,
      });
    }
    const { rows, rowCount } = await db.query(
      `select * from users where email=$1`,
      [user.email]
    );
    if (rowCount && rowCount > 0) {
      if (rows[0].is_verified) {
        const { accessToken, refreshToken } =
          this.generateAccessAndRefreshToken(rows[0]);

        await db.query("update users set refresh_token = $1 where email = $2", [
          refreshToken,
          user.email,
        ]);

        return res
          .cookie("accessToken", accessToken, {
            secure: true,
            httpOnly: false,
            sameSite: "none",
          })
          .cookie("refreshToken", refreshToken, {
            secure: true,
            httpOnly: false,
            sameSite: "none",
          })
          .redirect(`http://localhost:5173`);
      } else {
        const { accessToken, refreshToken } =
          this.generateAccessAndRefreshToken(rows[0]);

        await db.query(
          "update users set refresh_token = $1,is_verified=$2 where email = $3",
          [refreshToken, true, user.email]
        );

        return res
          .cookie("accessToken", accessToken, {
            secure: true,
            httpOnly: false,
            sameSite: "none",
          })
          .cookie("refreshToken", refreshToken, {
            secure: true,
            httpOnly: false,
            sameSite: "none",
          })
          .redirect(`http://localhost:5173`);
      }
    }

    const { rows: authUser } = await db.query(
      "INSERT INTO users (name, username, email,avatar,is_verified) VALUES ($1,$2,$3,$4,$5) RETURNING id",
      [user.name, user.username, user.email, user.avatar, true]
    );
    user.id = authUser[0].id;
    const { accessToken, refreshToken } =
      this.generateAccessAndRefreshToken(user);

    await db.query("update users set refresh_token = $1 where email = $2", [
      refreshToken,
      user.email,
    ]);

    return res
      .cookie("accessToken", accessToken, {
        secure: true,
        httpOnly: false,
        sameSite: "none",
      })
      .cookie("refreshToken", refreshToken, {
        secure: true,
        httpOnly: false,
        sameSite: "none",
      })
      .redirect(`http://localhost:5173`);
  }

  authenticateUser(req: Request, res: Response, next: NextFunction) {
    const { user } = req.body;

    return res.status(200).json(user);
  }

  async authenticateByResfreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { refreshToken: refToken } = req.cookies;
    if (!refToken) {
      return next({ message: "Refresh Token not found", status: 404 });
    }
    const { id }: any = verify(refToken, env.JWT_REFRESH_TOKEN_SECRET!);
    if (!id) {
      return next({ message: "Invalid Refresh Token", status: 404 });
    }

    const { rows } = await db.query(`SELECT * from users where id = $1`, [id]);

    if (rows.length < 1) {
      return next({ status: 404, message: "User not found" });
    }

    const { accessToken, refreshToken } = this.generateAccessAndRefreshToken(
      rows[0]
    );
    await db.query(`update users set refresh_token=$1 where email=$2`, [
      refreshToken,
      rows[0].email,
    ]);

    res
      .cookie("accessToken", accessToken, {
        secure: true,
        httpOnly: false,
        sameSite: "none",
      })
      .cookie("refreshToken", refreshToken, {
        secure: true,
        httpOnly: false,
        sameSite: "none",
      });

    return res
      .status(200)
      .json({ message: "User logged in by using refreshToken successfully" });
  }

  async logoutUser(req: Request, res: Response, next: NextFunction) {
    res
      .clearCookie("refreshToken", {
        secure: true,
        httpOnly: false,
        sameSite: "none",
      })
      .clearCookie("accessToken", {
        secure: true,
        httpOnly: false,
        sameSite: "none",
      })
      .json({ message: "User logged out successfully" });
  }

  encryptToken = (token: string): string => {
    const key = Buffer.from("12345678901234567890123456789012");
    const algorithm = "aes-256-cbc";
    const initVector = Buffer.from("1234567890abcdef");
    const cipher = createCipheriv(algorithm, key, initVector);
    return cipher.update(token, "utf8", "hex") + cipher.final("hex");
  };

  decryptToken = (token: string): string => {
    const key = Buffer.from("12345678901234567890123456789012");
    const algorithm = "aes-256-cbc";
    const initVector = Buffer.from("1234567890abcdef");
    const decipher = createDecipheriv(algorithm, key, initVector);
    return decipher.update(token, "hex", "utf8") + decipher.final("utf8");
  };

  hashPassword = async (password: string): Promise<string> => {
    const hashPassword = await hash(password, 16);

    return hashPassword;
  };
  verifyPassword = async (
    password: string,
    actual_password: string
  ): Promise<boolean> => {
    const is_correct_password = await compare(password, actual_password);
    return is_correct_password;
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
  generateAccessAndRefreshToken = function (user: any) {
    const refreshToken = sign({ id: user.id }, env.JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: "15d",
    });
    const accessToken = sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
      env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: "2d" }
    );

    return { refreshToken, accessToken };
  };
}

export const userController = new UserController();
