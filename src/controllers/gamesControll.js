import { clientpg } from '../db/postgres.js';
import { gameSchema } from '../schemas/schemas.js';

export async function getGames (req, res){
    let { name } = req.query;
    
    try {

        if(name){
            name = name + '%'; name = name.toLowerCase();

            const { rows: queryGames} = await clientpg.query(`SELECT * FROM games WHERE lower(name) LIKE $1`, [name]);

            return res.status(200).send(queryGames);            
        }

        const { rows: queryGames} = await clientpg.query('SELECT * FROM games');

        res.status(200).send(queryGames);
    } catch (error) {
        console.log(error)
        res.status(500).send('Server error');
    }
}


export async function insertGame (req, res){ // & WITH BUG FIX LATER... 
    const gameToInsert = req.body;
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    const { error } = gameSchema.validate(gameToInsert)

    if(error){
        return res.sendStatus(400)
    }
    
    try {
        const { rows: queryFindName} = await clientpg.query(`SELECT * FROM games WHERE name = $1`, [name]);
        if(queryFindName.length > 0){
            return res.sendStatus(409)
        }

        const { rows: queryFindCategorie} = await clientpg.query(`SELECT * FROM categories WHERE id = $1`, [categoryId]);

        if(queryFindCategorie.length === 0){
            return res.sendStatus(400)
        }

        const { rows: queryInsertGame} = await clientpg
        .query(`INSERT INTO games (name, image, stocktotal, categoryId, pricePerDay) VALUES ($1, $2, $3 , $4, $5)`,
        [name, image, stockTotal, categoryId, pricePerDay]);

        console.log(queryInsertGame)

        return res.sendStatus(200);
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }

    
    
    // console.log(categoryId)
}