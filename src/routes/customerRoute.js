import { Router } from "express";

import { getCustomers,getCustomersById, postCustomers, updateCustomer } from "../controllers/customersController.js";

const router = Router();

router.get("/customers",getCustomers);
router.get("/customers/:id",getCustomersById);
router.post("/customers",postCustomers);
router.put("/customers/:id",updateCustomer);

export default router;