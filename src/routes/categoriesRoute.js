import { Router } from "express";

import { getCategories, postCategories } from "../controllers/categoriesController.js";
import { validateCategories } from "../middlewares/validateCategories.js";

const router = Router();

router.get("/categories", getCategories);
router.post("/categories", validateCategories, postCategories);

export default router;