import { queryDb } from "@/db/connect";
import { NextFunction, Request, Response } from "express";

import { DatabaseError } from "pg";

class ProfileController {
  constructor() {
    this.getProfile = this.getProfile.bind(this);
  }
  async getProfile(req: Request, res: Response, next: NextFunction) {
    const { user: authUser } = req.body;

    try {
      const query = `
    SELECT 
      u.name,
      u.username,
      u.avatar,
      u.created_at,
      u.profession,
      row_to_json(ab) AS about,
      row_to_json(sl) AS social_links,
      row_to_json(ust) AS user_stats
    FROM 
      users u
    LEFT JOIN 
      about ab ON u.id = ab.user_id
    LEFT JOIN 
      social_links sl ON u.id = sl.user_id
    LEFT JOIN 
      user_stats ust ON u.id = ust.user_id
    WHERE 
      u.id = $1
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
}

export const profileController = new ProfileController();
