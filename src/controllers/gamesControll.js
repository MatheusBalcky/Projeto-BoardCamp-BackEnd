import { clientpg } from '../db/postgres.js';

export async function getGames (req, res){
    let { name } = req.query;
    
    try {
        const { rows: queryCategoriesGames } = await clientpg.query(`SELECT * FROM categories`);
        const { rows: queryGames} = await clientpg.query('SELECT * FROM games');

        if(name){
            name = name + '%'; name = name.toLowerCase();

            const { rows: queryGames} = await clientpg.query(`SELECT * FROM games WHERE lower(name) LIKE $1`, [name]);
            
            const gamesWithCategoriesArr = queryGames.map( game =>{
                const objectReturn = {
                    ...game,
                    categoryName: queryCategoriesGames.find( categ => game.categoryId === categ.id).name
                }
                return objectReturn;
            });

            return res.status(200).send(gamesWithCategoriesArr);            
        }

        const gamesWithCategoriesArr = queryGames.map( game =>{
            const objectReturn = {
                ...game,
                categoryName: queryCategoriesGames.find( categ => game.categoryId === categ.id).name
            }
            return objectReturn;
        });

        res.status(200).send(gamesWithCategoriesArr);

    } catch (error) {
        console.log(error)
        res.status(500).send('Server error');
    }
}


export async function insertGame (req, res){
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
    
    try {
        const { rows: queryInsertGame} = await clientpg
        .query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") 
                VALUES ($1, $2, $3 , $4, $5)`,[name, image, stockTotal, categoryId, pricePerDay]);

        return res.sendStatus(200);
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }
}