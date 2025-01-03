import { Router } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { checkAuth } from "../middleware";
import { squadController } from "./squads.controller";

const router = Router();

router.use(checkAuth);
router.post("/create", asyncHandler(squadController.createSquad));
router.get("/my", asyncHandler(squadController.mySquads));
router.get(
  "/details/:squad_handle",
  asyncHandler(squadController.squadDetails)
);
router.get("/", asyncHandler(squadController.getSquads));
router.put("/edit/:squad_handle", asyncHandler(squadController.updateSquad));
router.put("/join", asyncHandler(squadController.joinSquad));
router.put("/leave", asyncHandler(squadController.leaveSquad));
router.get("/members", asyncHandler(squadController.getSquadMembers));
router.delete("/:squad_handle", asyncHandler(squadController.deleteSquad));

export { router as squadRouter };
