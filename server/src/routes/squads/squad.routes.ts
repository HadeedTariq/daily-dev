import { Router } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { checkAuth } from "../middleware";
import { squadController } from "./squads.controller";

const router = Router();

router.use(checkAuth);
router.post("/create", asyncHandler(squadController.createSquad));
router.get("/", asyncHandler(squadController.getSquads));
router.get("/members", asyncHandler(squadController.getSquadMembers));
router.post("/add-member", asyncHandler(squadController.addMember));
router.put("/:squadId", asyncHandler(squadController.editSquad));
router.delete("/:squadId", asyncHandler(squadController.deleteSquad));

export { router as squadRouter };
