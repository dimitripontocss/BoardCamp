import { Router } from "express";

import { getCategories, postCategories } from "../controllers/categoriesController.js";

const router = Router();

router.post("/categories",postCategories);
router.get("/categories",getCategories);

export default router;