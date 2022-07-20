import { Router } from "express";

import categoriesRouter from "./categoriesRoute.js"

const router = Router();
router.use([categoriesRouter]);

export default router;