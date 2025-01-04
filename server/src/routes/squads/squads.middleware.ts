import { env } from "@/common/utils/envConfig";
import { queryDb } from "@/db/connect";
import { NextFunction, Request, Response } from "express";

export async function isSquadAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = req.body.user;
  const { squad_id } = req.params;

  if (!squad_id) {
    return res.status(400).json({ message: "Squad ID is required." });
  }

  const { rows } = await queryDb(
    `SELECT 1 from squad_members where squad_id =$1 and user_id = $2 and role=$3`,
    [Number(squad_id), user.id, "admin"]
  );
  if (rows.length < 1) {
    return res
      .status(403)
      .json({ message: "You are not an admin of this squad." });
  }
  next();
}
