import db from "../database/postgres.js";

export async function getCategories(req,res){
    const categories = await db.query("SELECT * FROM categories")
    res.send(categories.rows);
}