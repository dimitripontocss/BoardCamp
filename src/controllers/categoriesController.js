import db from "../database/postgres.js";

import handleError from "../utils/handleError.js"

export async function getCategories(req,res){
    try{
        const categories = await db.query("SELECT * FROM categories")
        res.send(categories.rows);
    }catch(error){
        return handleError({status:500, msg:error.message, res})
    }  
}

export async function postCategorie(req,res){
    try{
        const name = res.locals.name;
        await db.query("INSERT INTO categories (name) VALUES ($1)", [name]);
        res.sendStatus(201);
    }catch(error){
        console.log(error);
		return handleError({status:500, msg:error.message, res}) 
    }
}