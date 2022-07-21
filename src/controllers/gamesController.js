import db from "../database/postgres.js"; 

import handleError from "../utils/handleError.js"

async function correctObject(game){
    const category = await db.query("SELECT * FROM categories WHERE id = $1", [game.categoryId]);
    const categoryName = category.rows[0].name;
    const sendableGame = {
        id: game.id,
        name: game.name,
        image:  game.image,
        stockTotal: game.stockTotal,
        categoryId: game.categoryId,
        pricePerDay: game.pricePerDay,
        categoryName
    }
    return sendableGame;
}

export async function getGames(req,res){
    const name = req.query.name.toLowerCase();
    try{
        let games = [];
        if(name){
            console.log(name)
            games = await db.query('SELECT * FROM games WHERE LOWER(name) LIKE $1',[name + '%']);
        }
        else{
            games = await db.query("SELECT * FROM games");
        }
        let treatedGames = [];
        for(let i=0;i<games.rows.length;i++){
            const treatedGame = await correctObject(games.rows[i]);
            treatedGames.push(treatedGame);
        }
        res.send(treatedGames);
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