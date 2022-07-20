import dayjs from "dayjs";

import db from "../database/postgres.js";

import handleError from "../utils/handleError.js";

async function transformRentals(rental){
    const customerAux = await db.query('SELECT * FROM customers WHERE id=$1',[rental.customerId]);
    const gameAux = await db.query('SELECT * FROM games WHERE id=$1',[rental.gameId]);
    
    const categoryNameAux = await db.query('SELECT * FROM categories WHERE id=$1',[gameAux.rows[0].categoryId]);
    const categoryName =categoryNameAux.rows[0].name;

    const customer = {
        id: customerAux.rows[0].id,
        name: customerAux.rows[0].name
    }
    const game = {
        id: gameAux.rows[0].id,
        name: gameAux.rows[0].name,
        categoryId: gameAux.rows[0].categoryId,
        categoryName
    }
    
    const sendableRental = {...rental, customer, game};
    return sendableRental;
}

export async function getRentals(req,res){
    const customerId = req.query.customerId;
    const gameId = req.query.gameId;
    try{
        let rentals = [];
        if(customerId === undefined && gameId === undefined){
            rentals = await db.query("SELECT * FROM rentals");
        }
        if(customerId !== undefined){
            rentals = await db.query('SELECT * FROM rentals WHERE "customerId" = $1',[customerId]);
        }
        if(gameId !== undefined){
            rentals = await db.query('SELECT * FROM rentals WHERE "gameId" = $1',[gameId]);
        }
        
        let treatedRentals = [];
        for(let i=0;i<rentals.rows.length;i++){
            const treatedRental = await transformRentals(rentals.rows[i]);
            treatedRentals.push(treatedRental);
        }
        res.send(treatedRentals);
    }catch(error){
        return handleError({status:500, msg:error.message, res})
    }  
}

export async function postRental(req,res){
    try{   
        const newRental =res.locals.newRental;
        const gameExist =res.locals.gameExist;

        const date = dayjs().format('YYYY-MM-DD');
        const price = newRental.daysRented * gameExist.rows[0].pricePerDay;
        
        await db.query('INSERT INTO rentals ("customerId","gameId","rentDate","daysRented","returnDate","originalPrice","delayFee") VALUES ($1,$2,$3,$4,$5,$6,$7)',
            [newRental.customerId, newRental.gameId, date, newRental.daysRented, null, price, null]);

        await db.query('UPDATE games SET "stockTotal"=$1 WHERE id=$2',[gameExist.rows[0].stockTotal - 1, newRental.gameId]);

        res.sendStatus(201);

    }catch(error){
        console.log(error);
		return handleError({status:500, msg:error.message, res}) 
    }
}

export async function returnRental(req,res){
    try{   
        const rental = res.locals.rental;
        const id = res.locals.id;
        
        const dayDiff = Math.ceil((Date.now()-rental.rentDate.getTime()) / (1000*3600*24));
        const date = dayjs().format('YYYY-MM-DD');
        const fee = (rental.originalPrice/rental.daysRented) * (dayDiff - 1);

        await db.query('UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3',[date,fee,id])
        const game = await db.query('SELECT * FROM games WHERE id=$1',[rental.gameId]);
        await db.query('UPDATE games SET "stockTotal"=$1 WHERE id=$2',[game.rows[0].stockTotal + 1, rental.gameId]);
        res.sendStatus(201);
    }catch(error){
        console.log(error);
		return handleError({status:500, msg:error.message, res}) 
    }
}

export async function deleteRental(req,res){
    try{   
        const rental = res.locals.rental;
        const id = res.locals.id;

        const game = await db.query('SELECT * FROM games WHERE id=$1',[rental.gameId]);
        await db.query('UPDATE games SET "stockTotal"=$1 WHERE id=$2',[game.rows[0].stockTotal + 1, rental.gameId]);
        
        await db.query('DELETE FROM rentals WHERE id=$1',[id]);
        res.sendStatus(200);
    }catch(error){
        console.log(error);
		return handleError({status:500, msg:error.message, res}) 
    }
}