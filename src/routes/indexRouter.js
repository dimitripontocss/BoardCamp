import { Router } from "express";

import categoriesRouter from "./categoriesRoute.js"
import gamesRoute from "./gamesRoute.js";
import customerRouter from "./customerRoute.js";
import rentalsRoute from "./rentalsRoute.js";

const router = Router();
router.use([categoriesRouter,gamesRoute,customerRouter,rentalsRoute]);

export default router;