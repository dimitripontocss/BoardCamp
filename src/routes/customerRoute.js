import { Router } from "express";

import { getCustomers,getCustomersById, postCustomers, updateCustomer } from "../controllers/customersController.js";
import { validateCustomerUpdate, validateNewCustomer } from "../middlewares/validateCustomers.js";

const router = Router();

router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomersById);
router.post("/customers", validateNewCustomer, postCustomers);
router.put("/customers/:id", validateCustomerUpdate, updateCustomer);

export default router;