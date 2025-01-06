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
    this.joinSquad = this.joinSquad.bind(this);
    this.leaveSquad = this.leaveSquad.bind(this);
    this.updateSquad = this.updateSquad.bind(this);
    this.deleteSquad = this.deleteSquad.bind(this);
    this.makeAdmin = this.makeAdmin.bind(this);
    this.makeModerator = this.makeModerator.bind(this);
    this.makeMember = this.makeMember.bind(this);
    this.removeMember = this.removeMember.bind(this);
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
        squad_handle.trim().split(" ").join(""),
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
            ),
            filtered_squad_members AS (
                SELECT 
                    squad_members.role,
                    squad_members.user_id
                FROM squad_members
                WHERE squad_members.squad_id = (SELECT squad_id FROM selected_squad)
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
                            'post_upvotes', COALESCE(post_upvotes.upvotes, 0),
                            'post_views', COALESCE(post_views.views, 0),
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
                ) AS squad_posts,
                (
                    SELECT JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'role', fsm.role,
                            'userDetails', JSON_BUILD_OBJECT(
                                'userId', users.id,
                                'name', users.name,
                                'username', users.username,
                                'email', users.email,
                                'avatar', users.avatar,
                                'profession', users.profession
                            )
                        )
                    )
                    FROM filtered_squad_members fsm
                    inner JOIN users ON fsm.user_id = users.id
                ) AS squad_members
            FROM selected_squad s;
    `;

    const { rows } = await queryDb(query, [squad_handle]);
    return res.status(200).json(rows[0]);
  }
  async mySquads(req: Request, res: Response, next: NextFunction) {
    const query = `
          SELECT 
            id,
            name as squad_name,
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

      res.status(200).json(rows);
    } catch (error) {
      next(error);
    }
  }
  async joinSquad(req: Request, res: Response, next: NextFunction) {
    const { squad_handle, squad_id } = req.body;

    if (!squad_handle || !squad_id) {
      return res
        .status(400)
        .json({ message: "Squad handle and ID are required." });
    }

    const query = `
      WITH check_user AS (
        SELECT id
        FROM squad_members
        WHERE squad_id = $1 AND user_id = $2
      )
      INSERT INTO squad_members (squad_id, user_id)
      SELECT $1, $2
      WHERE NOT EXISTS (SELECT 1 FROM check_user)
      RETURNING id;
    `;

    try {
      const { rows } = await queryDb(query, [squad_id, req.body.user.id]);

      if (rows.length === 0) {
        return res
          .status(400)
          .json({ message: "You already joined the squad" });
      }

      res.status(201).json({ message: "Successfully joined the squad" });
    } catch (error) {
      next(error);
    }
  }
  async leaveSquad(req: Request, res: Response, next: NextFunction) {
    const { squad_id } = req.body;

    if (!squad_id) {
      return res.status(400).json({ message: "Squad ID is required." });
    }

    const userId = req.body.user.id;

    const query = `
      DELETE FROM squad_members
      WHERE squad_id = $1 AND user_id = $2
      RETURNING id;
    `;

    try {
      const { rows } = await queryDb(query, [squad_id, userId]);

      if (rows.length === 0) {
        return res
          .status(400)
          .json({ message: "You are not a member of this squad." });
      }

      res.status(200).json({ message: "Successfully left the squad" });
    } catch (error) {
      next(error);
    }
  }

  async updateSquad(req: Request, res: Response, next: NextFunction) {
    const { squad_handle, squad_id } = req.params;
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
        WHERE squad_handle = $10 and id = $11
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
        squad_id,
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
    const { squad_id } = req.params;

    try {
      const query = `
        DELETE FROM squads WHERE  id = $1 RETURNING id;
      `;
      const { rows } = await queryDb(query, [Number(squad_id)]);

      if (rows.length === 0) {
        return res.status(404).json({ message: "Squad not found." });
      }

      res.status(200).json({ message: "Squad deleted successfully." });
    } catch (error) {
      next(error);
    }
  }
  async makeAdmin(req: Request, res: Response, next: NextFunction) {
    const { squad_id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "User id is required." });
    }

    try {
      const query = `
        UPDATE squad_members 
        SET role = 'admin' 
        WHERE squad_id = $1 AND user_id = $2 
        RETURNING role;
      `;
      const { rows } = await queryDb(query, [
        Number(squad_id),
        Number(user_id),
      ]);

      if (rows.length === 0) {
        return res
          .status(404)
          .json({ message: "User not found or update failed." });
      }

      res
        .status(200)
        .json({ message: `User role updated to ${rows[0].role}.` });
    } catch (error) {
      next(error);
    }
  }

  async makeModerator(req: Request, res: Response, next: NextFunction) {
    const { squad_id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "User id is required." });
    }

    try {
      const query = `
        UPDATE squad_members 
        SET role = 'moderator' 
        WHERE squad_id = $1 AND user_id = $2 
        RETURNING role;
      `;
      const { rows } = await queryDb(query, [
        Number(squad_id),
        Number(user_id),
      ]);

      if (rows.length === 0) {
        return res
          .status(404)
          .json({ message: "User not found or update failed." });
      }

      res
        .status(200)
        .json({ message: `User role updated to ${rows[0].role}.` });
    } catch (error) {
      next(error);
    }
  }
  async makeMember(req: Request, res: Response, next: NextFunction) {
    const { squad_id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "User id is required." });
    }

    try {
      const query = `
        UPDATE squad_members 
        SET role = 'member' 
        WHERE squad_id = $1 AND user_id = $2 
        RETURNING role;
      `;
      const { rows } = await queryDb(query, [
        Number(squad_id),
        Number(user_id),
      ]);

      if (rows.length === 0) {
        return res
          .status(404)
          .json({ message: "User not found or update failed." });
      }

      res
        .status(200)
        .json({ message: `User role updated to ${rows[0].role}.` });
    } catch (error) {
      next(error);
    }
  }

  async removeMember(req: Request, res: Response, next: NextFunction) {
    const { squad_id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "User id is required." });
    }

    try {
      const query = `
        delete from  squad_members 
        WHERE squad_id = $1 AND user_id = $2 
        RETURNING role;
      `;
      const { rows } = await queryDb(query, [
        Number(squad_id),
        Number(user_id),
      ]);

      if (rows.length === 0) {
        return res
          .status(404)
          .json({ message: "User not found or update failed." });
      }

      res.status(200).json({ message: `Remove Member successfully` });
    } catch (error) {
      next(error);
    }
  }
}

export const squadController = new SquadController();
