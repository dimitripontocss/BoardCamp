import { Router } from "express";

import { getGames, postGames } from "../controllers/gamesController.js";
import { validateGame } from "../middlewares/validateGames.js";

const router = Router();

router.get("/games", getGames);
router.post("/games", validateGame, postGames);

export default router;