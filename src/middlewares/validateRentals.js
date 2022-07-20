import db from "../database/postgres.js";

import ApiError from "../utils/apiError.js";
import handleError from "../utils/handleError.js";

export async function validateRental(req,res,next){
    const id = req.params.id;
    try{   
        const possibleRental = await db.query('SELECT * FROM rentals WHERE id=$1',[id]);
        if(possibleRental.rows.length === 0){
            throw new ApiError("Não existem alugueis com esse ID.",404);
        }
        const rental = possibleRental.rows[0];
        
        if(rental.returnDate !== null){
            throw new ApiError("Aluguel já foi finalizado.",400);
        }
        res.locals.id = id;
        res.locals.rental = rental;
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

export async function validateNewRental(req,res,next){
    const newRental = req.body;
    try{   
        const gameExist = await db.query("SELECT * FROM games WHERE id = $1", [newRental.gameId]);
        if(gameExist.rows.length === 0){
            throw new ApiError("Não existe um jogo com esse ID.",400);
        }
        const customerExist = await db.query("SELECT * FROM customers WHERE id = $1", [newRental.customerId]);
        if(customerExist.rows.length === 0){
            throw new ApiError("Não existe um cliente com esse ID.",400);
        }

        if(newRental.daysRented <= 0){
            throw new ApiError("Selecione uma data valida para aluguel.",400);
        }
        if(gameExist.rows[0].stockTotal === 0){
            throw new ApiError("Este jogo não está disponível para aluguel.",400);
        }

        res.locals.newRental = newRental;
        res.locals.gameExist = gameExist;
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