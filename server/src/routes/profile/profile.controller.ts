import { queryDb } from "@/db/connect";
import { NextFunction, Request, Response } from "express";

import { DatabaseError } from "pg";

class ProfileController {
  constructor() {
    this.getProfile = this.getProfile.bind(this);
    this.editProfile = this.editProfile.bind(this);
    this.readmeHandler = this.readmeHandler.bind(this);
  }
  async getProfile(req: Request, res: Response, next: NextFunction) {
    const { user: authUser } = req.body;

    try {
      const query = `
    SELECT 
      u.name,
      u.username,
      u.avatar,
      u.email,
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

  async editProfile(req: Request, res: Response, next: NextFunction) {
    const {
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
      threads,
    } = req.body;

    if (username || avatar || name || email || profession) {
      const query = `UPDATE users SET username=$1, avatar=$2, name=$3, email=$4, profession=$5 WHERE id=$6 RETURNING *`;
      const { rows } = await queryDb(query, [
        username,
        avatar,
        name,
        email,
        profession,
        req.body.user.id,
      ]);

      if (rows.length === 0) {
        return next({ status: 404, message: "User not found" });
      }
    }

    if (bio || company || job_title) {
      const query = `UPDATE about SET bio=$1, company=$2, job_title=$3 WHERE user_id=$4 RETURNING *`;
      const { rows: aboutRows } = await queryDb(query, [
        bio,
        company,
        job_title,
        req.body.user.id,
      ]);

      if (aboutRows.length === 0) {
        return next({ status: 404, message: "User not found" });
      }
    }

    if (
      github ||
      linkedin ||
      website ||
      x ||
      youtube ||
      stack_overflow ||
      reddit ||
      roadmap_sh ||
      codepen ||
      mastodon ||
      threads
    ) {
      const { rows: socialLinksRows } = await queryDb(
        `
        UPDATE social_links 
        SET 
          github = $1, 
          linkedin = $2, 
          website = $3, 
          x = $4, 
          youtube = $5, 
          stack_overflow = $6, 
          reddit = $7, 
          roadmap_sh = $8, 
          codepen = $9, 
          mastodon = $10, 
          threads = $11 
        WHERE user_id = $12 
        RETURNING *;
        `,
        [
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
          threads,
          req.body.user.id,
        ]
      );

      if (socialLinksRows.length === 0) {
        return next({ status: 404, message: "User not found" });
      }
    }

    res.status(200).json({ message: "Profile Updated Successfully" });
  }
  async readmeHandler(req: Request, res: Response, next: NextFunction) {
    const { readme } = req.body;

    if (!readme || typeof readme !== "string") {
      return res.status(400).json({
        error: 'The "readme" field is required and should be a string.',
      });
    }

    const query = "update  about set readme= $1  where user_id = $2";
    const values = [readme, req.body.user.id];

    await queryDb(query, values);

    return res.status(201).json({
      message: "Readme successfully saved.",
    });
  }
}

export const profileController = new ProfileController();
