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
    this.addMember = this.addMember.bind(this);
    this.editSquad = this.editSquad.bind(this);
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
        )
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

      res.status(201).json({
        message: "Squad created successfully.",
      });
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
    await queryDb(query, [squadName, req.body.user.id]);

    res.status(201).json({ message: "Member added successfully." });
  }

  async editSquad(req: Request, res: Response, next: NextFunction) {
    const { squadId } = req.params;
    const { name } = req.body;

    try {
      const query = `
        UPDATE squads
        SET name = COALESCE($1, name)
        WHERE id = $2
        RETURNING *;
      `;
      const { rows } = await queryDb(query, [name, squadId]);

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
