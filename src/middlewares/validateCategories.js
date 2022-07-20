import db from "../database/postgres.js";

import categorieSchema from "../schemas/categorieSchema.js"

import ApiError from "../utils/apiError.js";
import handleError from "../utils/handleError.js";

export async function validateCategories(req,res,next){
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
        res.locals.name = name;
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