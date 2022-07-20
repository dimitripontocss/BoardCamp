import db from "../database/postgres.js";

import handleError from "../utils/handleError.js";
import ApiError from "../utils/apiError.js";


//Falta a query
export async function getCustomers(req,res){
    try{
        const customers = await db.query("SELECT * FROM customers");
        res.send(customers.rows);
    }catch(error){
        return handleError({status:500, msg:error.message, res})
    }  
}

export async function getCustomerById(req,res){
    const id = req.params.id;
    try{
        const customer = await db.query("SELECT * FROM customers WHERE id=$1",[id]);
        if(customer.rows.length === 0){
            throw new ApiError("Não existe usuário com este Id",404);
        }
        res.send(customer.rows[0]);
    }catch(error){
        console.log(error);
		if(error instanceof ApiError){
			const {status ,message} = error;
			return handleError({status, message, res});
		}
		return handleError({status:500, msg:error.message, res});
    }  
}

export async function postCustomer(req,res){
    const newCustomer = res.locals.newCustomer;
    try{
        await db.query('INSERT INTO customers (name,phone,cpf,birthday) VALUES ($1,$2,$3,$4)',
         [newCustomer.name,newCustomer.phone,newCustomer.cpf, newCustomer.birthday]);
        res.sendStatus(201);
    }catch(error){
        console.log(error);
		return handleError({status:500, msg:error.message, res}) 
    }
}

//Falta testar
export async function updateCustomer(req,res){
    const id = req.params.id;
    const newCustomer = res.locals.newCustomer;
    try{
        await db.query('UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5',
         [newCustomer.name,newCustomer.phone,newCustomer.cpf, newCustomer.birthday, id]);
        res.sendStatus(200);
    }catch(error){
        console.log(error);
		return handleError({status:500, msg:error.message, res}) 
    }

}