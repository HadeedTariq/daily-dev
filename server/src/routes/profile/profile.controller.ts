import { queryDb } from "@/db/connect";
import { NextFunction, Request, Response } from "express";
import sanitizeHtml from "sanitize-html";

import { DatabaseError } from "pg";

class ProfileController {
  constructor() {
    this.getProfile = this.getProfile.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
    this.editProfile = this.editProfile.bind(this);
    this.readmeHandler = this.readmeHandler.bind(this);
    this.updateStreak = this.updateStreak.bind(this);
    this.getMyJoinedSquads = this.getMyJoinedSquads.bind(this);
    this.getUserJoinedSquads = this.getUserJoinedSquads.bind(this);
  }
  async getUserProfile(req: Request, res: Response, next: NextFunction) {
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
    } catch (error: any) {
      console.log(error);

      if (error instanceof DatabaseError) {
        return next({ status: 500, message: "Database query error" });
      }

      next(error);
    }
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
          row_to_json(ust) AS user_stats,
          row_to_json(stk) AS streaks
        FROM 
          users u
        LEFT JOIN 
          about ab ON u.id = ab.user_id
        LEFT JOIN 
          social_links sl ON u.id = sl.user_id
        LEFT JOIN 
          user_stats ust ON u.id = ust.user_id
        LEFT JOIN 
          streaks stk ON u.id = stk.user_id
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

  async getUserJoinedSquads(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.query;
      if (!userId || isNaN(userId as any)) {
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
          squads: [],
        });
      }

      res.status(200).json({
        squads,
      });
    } catch (error) {
      next(error);
    }
  }
  async getMyJoinedSquads(req: Request, res: Response, next: NextFunction) {
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
          squads: [],
        });
      }

      res.status(200).json({
        squads,
      });
    } catch (error) {
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
  async updateStreak(req: Request, res: Response, next: NextFunction) {
    const { user } = req.body;
    const currentDate = new Date();

    const { rows } = await queryDb(
      `SELECT updated_at, streak_length, longest_streak FROM streaks WHERE user_id = $1`,
      [user.id]
    );

    if (rows.length === 0) {
      return next({ status: 404, message: "User not found" });
    }

    const lastUpdated = new Date(rows[0].updated_at);
    const sameDay =
      currentDate.toISOString().split("T")[0] ===
      lastUpdated.toISOString().split("T")[0];

    if (sameDay) {
      return res.status(204).json({});
    }

    const diffDays = Math.floor(
      (Number(currentDate) - Number(lastUpdated)) / (1000 * 60 * 60 * 24)
    );
    let query, values;

    if (diffDays > 1) {
      const longestStreak = Math.max(
        rows[0].streak_length,
        rows[0].longest_streak
      );
      query = `
        UPDATE streaks
        SET streak_length = $1, updated_at = $2, streak_end = $2, streak_start = $2, longest_streak = $3
        WHERE user_id = $4
      `;
      values = [1, currentDate, longestStreak, user.id];
    } else {
      query = `
        UPDATE streaks
        SET streak_length = streak_length + 1, updated_at = $1
        WHERE user_id = $2
      `;
      values = [currentDate, user.id];
    }

    await queryDb(query, values);

    return res.status(201).json({
      message: "Streak updated successfully",
    });
  }
  async readmeHandler(req: Request, res: Response, next: NextFunction) {
    const { readme } = req.body;

    if (!readme || typeof readme !== "string") {
      return res.status(400).json({
        error: 'The "readme" field is required and should be a string.',
      });
    }
    const sanitizedReadme = sanitizeHtml(readme, {
      allowedTags: [],
      allowedAttributes: {},
    });

    const query = "update  about set readme= $1  where user_id = $2";
    const values = [sanitizedReadme, req.body.user.id];

    await queryDb(query, values);

    return res.status(201).json({
      message: "Readme successfully saved.",
    });
  }
}

export const profileController = new ProfileController();
