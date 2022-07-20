import db from "../database/postgres.js";

import handleError from "../utils/handleError.js";
import ApiError from "../utils/apiError.js";

import customerSchema from "../schemas/customerSchema.js";

export async function validateNewCustomer(req,res,next){
    const newCustomer = req.body;
    try{
        const { error } = customerSchema.validate(newCustomer);
		if(error){
			throw new ApiError("Ocorreram erros de validação.",400);
		}
        
        const cpfExist = await db.query("SELECT * FROM customers WHERE cpf = $1", [newCustomer.cpf]);
        if(cpfExist.rows.length !== 0){
            throw new ApiError("CPF já cadastrado.",409);
        }

        res.locals.newCustomer = newCustomer;
        next();
    }catch(error){
        console.log(error);
		if(error instanceof ApiError){
			const {status ,message} = error;
			return handleError({status, message, res});
		}
		return handleError({status:500, msg:error.message, res}) 
    }
}

export async function validateCustomerUpdate(req,res,next){
    const newCustomer = req.body;
    try{
        const { error } = customerSchema.validate(newCustomer);
		if(error){
			throw new ApiError("Ocorreram erros de validação.",400);
		}
        
        const cpfExist = await db.query("SELECT * FROM customers WHERE cpf = $1", [newCustomer.cpf]);
        if(cpfExist.rows[0].id !== id){
            throw new ApiError("CPF já cadastrado.",409);
        }

        res.locals.newCustomer = newCustomer;
        next();
    }catch(error){
        console.log(error);
		if(error instanceof ApiError){
			const {status ,message} = error;
			return handleError({status, message, res});
		}
		return handleError({status:500, msg:error.message, res}) 
    }
}

