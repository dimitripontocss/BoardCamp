import db from "../database/postgres.js"; 

import handleError from "../utils/handleError.js"

export async function getGames(req,res){
    const name = req.query.name;
    try{
        let games = [];
        if(name){
            games = await db.query('SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId"=categories.id WHERE LOWER(games.name) LIKE $1',[name.toLowerCase() + '%']);
        }
        else{
            games = await db.query('SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId"=categories.id ');
        }
        res.send(games.rows);
    }catch(error){
        return handleError({status:500, msg:error.message, res})
    }  
}


export async function postGame(req,res){
    const newGame = res.locals.newGame;
    try{
        await db.query('INSERT INTO games (name,image,"stockTotal","categoryId","pricePerDay") VALUES ($1,$2,$3,$4,$5)',
         [newGame.name.trim(),newGame.image,parseInt(newGame.stockTotal),newGame.categoryId, newGame.pricePerDay]);
        res.sendStatus(201);

    }catch(error){
        console.log(error);
		return handleError({status:500, msg:error.message, res}) 
    }
}