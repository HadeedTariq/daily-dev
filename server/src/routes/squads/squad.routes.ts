import { Router } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { checkAuth } from "../middleware";
import { squadController } from "./squads.controller";
import { isSquadAdmin } from "./squads.middleware";

const router = Router();

router.use(checkAuth);
router.post("/create", asyncHandler(squadController.createSquad));
router.get("/my", asyncHandler(squadController.mySquads));
router.get(
  "/details/:squad_handle",
  asyncHandler(squadController.squadDetails)
);

router.get("/posts/:squad_id", asyncHandler(squadController.getSquadPosts));
router.get("/", asyncHandler(squadController.getSquads));
router.put("/join", asyncHandler(squadController.joinSquad));
router.put("/leave", asyncHandler(squadController.leaveSquad));

// admin work

router.put(
  "/edit/:squad_id/:squad_handle",
  isSquadAdmin,
  asyncHandler(squadController.updateSquad)
);

router.put(
  "/:squad_id/make-admin",
  isSquadAdmin,
  asyncHandler(squadController.makeAdmin)
);
router.put(
  "/:squad_id/make-moderator",
  isSquadAdmin,
  asyncHandler(squadController.makeModerator)
);
router.put(
  "/:squad_id/make-member",
  isSquadAdmin,
  asyncHandler(squadController.makeMember)
);
router.put(
  "/:squad_id/remove-member",
  isSquadAdmin,
  asyncHandler(squadController.removeMember)
);
router.delete(
  "/:squad_id",
  isSquadAdmin,
  asyncHandler(squadController.deleteSquad)
);

export { router as squadRouter };
