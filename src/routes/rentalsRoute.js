import { Router } from "express";
import { deleteRental, getRentals, postRentals, returnRental } from "../controllers/rentalsController.js";

const router = Router();

router.get("/rentals",getRentals);
router.post("/rentals",postRentals);
router.post("/rentals/:id/return",returnRental);
router.delete("/rentals/:id",deleteRental);

export default router;