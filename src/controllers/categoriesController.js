import db from "../database/postgres.js";

import categorieSchema from "../schemas/categoriesSchema.js";

import handleError from "../utils/handleError.js"
import ApiError from "../utils/apiError.js"


export async function getCategories(req,res){
    try{
        const categories = await db.query("SELECT * FROM categories")
        res.send(categories.rows);
    }catch(error){
        return handleError({status:500, msg:error.message, res})
    }  
}

export async function postCategories(req,res){
    const { name } = req.body;
    try{
        const { error } = categorieSchema.validate(req.body);
		if(error){
			throw new ApiError("O nome não pode ser vazio.",400);
		}
        const { rows } = await db.query("SELECT * FROM categories WHERE name = $1", [name]);
        if(rows.length === 1){
            throw new ApiError("O nome já está em uso.",409);
        }
        await db.query("INSERT INTO categories (name) VALUES ($1)", [name]);
        res.sendStatus(201);

    }catch(error){
        console.log(error);
		if(error instanceof ApiError){
			const {status ,message} = error;
			return handleError({status, message, res});
		}
		return handleError({status:500, msg:error.message, res}) 
    }
}