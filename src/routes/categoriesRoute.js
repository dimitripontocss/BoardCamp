import { Router } from "express";

import { getCategories } from "../controllers/categoriesController.js";

const router = Router();

//router.post();
router.get("/categories",getCategories);

export default router;