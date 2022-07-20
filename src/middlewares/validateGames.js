import db from "../database/postgres.js";

import gameSchema from "../schemas/gameSchema.js";

import ApiError from "../utils/apiError.js";
import handleError from "../utils/handleError.js";


export async function validateGame(req,res,next){
    const newGame = req.body;
    try{
        const { error } = gameSchema.validate(newGame);
		if(error){
			throw new ApiError("Ocorreram erros de validação.",400);
		}
        
        const categoryExist = await db.query("SELECT * FROM categories WHERE id = $1", [newGame.categoryId]);
        if(categoryExist.rows.length === 0){
            throw new ApiError("Escolha uma categoria existente.",409);
        }

        const { rows } = await db.query("SELECT * FROM games WHERE name = $1", [newGame.name.trim()]);
        if(rows.length === 1){
            throw new ApiError("O nome já está em uso.",409);
        }

        res.locals.newGame = newGame;
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