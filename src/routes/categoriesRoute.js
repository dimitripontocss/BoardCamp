import { Router } from "express";

import { getCategories, postCategorie } from "../controllers/categoriesController.js";
import { validateCategorie } from "../middlewares/validateCategorie.js";

const router = Router();

router.get("/categories", getCategories);
router.post("/categories", validateCategorie, postCategorie);

export default router;