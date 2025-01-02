import { queryDb } from "@/db/connect";
import { NextFunction, Request, Response } from "express";
import { DatabaseError } from "pg";

export const squadCategories = [
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
  "general",
];

class SquadController {
  constructor() {
    this.getSquads = this.getSquads.bind(this);
    this.getSquadMembers = this.getSquadMembers.bind(this);
    this.createSquad = this.createSquad.bind(this);
    this.squadDetails = this.squadDetails.bind(this);
    this.addMember = this.addMember.bind(this);
    this.updateSquad = this.updateSquad.bind(this);
    this.deleteSquad = this.deleteSquad.bind(this);
  }

  async getSquads(req: Request, res: Response, next: NextFunction) {
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

  async getSquadMembers(req: Request, res: Response, next: NextFunction) {
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

  async createSquad(req: Request, res: Response, next: NextFunction) {
    const {
      name,
      squad_handle,
      description,
      category,
      is_public,
      post_creation_allowed_to,
      invitation_permission,
      post_approval_required,
    } = req.body;

    if (!name || !squad_handle) {
      return res.status(400).json({
        message: "Name, squad handle are required.",
      });
    }

    if (!squadCategories.includes(category)) {
      return res.status(400).json({
        message: "Invalid category",
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
        squad_handle,
        description || "",
        category || "general",
        is_public !== undefined ? is_public : true,
        req.body.user.id,
        post_creation_allowed_to || "members",
        invitation_permission || "members",
        post_approval_required || false,
      ]);

      await queryDb(
        `
            insert into squad_members (squad_id,user_id,role) values ($1,$2,$3)
        `,
        [rows[0].id, req.body.user.id, "admin"]
      );

      res.status(201).json({
        message: "Squad created successfully.",
      });
    } catch (error) {
      next(error);
    }
  }

  async squadDetails(req: Request, res: Response, next: NextFunction) {
    const { squad_handle } = req.params;

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
        )
        SELECT 
            s.*,
            (
                SELECT JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'post_id', posts.id,
                        'post_title', posts.title,
                        'post_thumbnail', posts.thumbnail,
                        'post_content', posts.content,
                        'post_created_at', posts.created_at,
                        'author_avatar', users.avatar,
                        'post_upvotes', post_upvotes.upvotes,
                        'post_views', post_views.views,
                        'post_tags', (
                            SELECT JSON_AGG(tag_id) 
                            FROM post_tags 
                            WHERE post_tags.post_id = posts.id
                        )
                    )
                )
                FROM posts
                LEFT JOIN users ON posts.author_id = users.id
                LEFT JOIN post_upvotes ON posts.id = post_upvotes.post_id
                LEFT JOIN post_views ON posts.id = post_views.post_id
                WHERE posts.squad_id = s.squad_id
            ) AS squad_posts
        FROM selected_squad s;
    `;

    const { rows } = await queryDb(query, [squad_handle]);
    return res.status(200).json(rows[0]);
  }
  async mySquads(req: Request, res: Response, next: NextFunction) {
    const query = `
          SELECT 
            id,
            name,
            squad_handle,
            description,
            category,
            is_public,
            post_creation_allowed_to,
            invitation_permission,
            post_approval_required,
            created_at,
            updated_at 
          FROM squads 
          WHERE admin_id = $1
  `;

    try {
      const { rows } = await queryDb(query, [req.body.user.id]);
      const { rows: users } = await queryDb(`SELECT * FROM users`);

      res.status(200).json(rows);
    } catch (error) {
      next(error);
    }
  }

  async addMember(req: Request, res: Response, next: NextFunction) {
    const { squadName, squadId } = req.body;

    if (!squadName || !squadId) {
      return res
        .status(400)
        .json({ message: "Squad name and Squad id are required." });
    }

    const user_already_in_squad_query = `
      select id from squad_members where squad_id =$1 and user_id =$2
    `;

    const { rows } = await queryDb(user_already_in_squad_query, [
      squadId,
      req.body.user.id,
    ]);

    if (rows.length > 0) {
      return res.status(400).json({ message: "User already in squad." });
    }

    const query = `
      INSERT INTO squad_members (squad_id, user_id)
      VALUES ($1, $2)
    `;
    await queryDb(query, [squadId, req.body.user.id]);

    res.status(201).json({ message: "Member added successfully." });
  }

  async updateSquad(req: Request, res: Response, next: NextFunction) {
    const { squad_handle } = req.params;
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
      thumbnail,
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
        WHERE squad_handle = $10
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
      ]);

      if (rows.length === 0) {
        return res.status(404).json({ message: "Squad not found." });
      }

      res.status(200).json({ message: "Squad updated successfully." });
    } catch (error) {
      next(error);
    }
  }

  async deleteSquad(req: Request, res: Response, next: NextFunction) {
    const { squadId } = req.params;

    try {
      const query = `
        DELETE FROM squads WHERE id = $1 RETURNING *;
      `;
      const { rows } = await queryDb(query, [squadId]);

      if (rows.length === 0) {
        return res.status(404).json({ message: "Squad not found." });
      }

      res.status(200).json({ message: "Squad deleted successfully." });
    } catch (error) {
      next(error);
    }
  }
}

export const squadController = new SquadController();
