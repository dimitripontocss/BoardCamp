import { Router } from "express";

import { getCustomers,getCustomerById, postCustomer, updateCustomer } from "../controllers/customersController.js";
import { validateCustomerUpdate, validateNewCustomer } from "../middlewares/validateCustomers.js";

const router = Router();

router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomerById);
router.post("/customers", validateNewCustomer, postCustomer);
router.put("/customers/:id", validateCustomerUpdate, updateCustomer);

export default router;