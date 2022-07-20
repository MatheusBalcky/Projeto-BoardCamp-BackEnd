import { clientpg } from '../db/postgres.js';

export async function getCategories (req, res){
    try {
        const { rows: queryCategories} = await clientpg.query('SELECT * FROM categories');

        res.status(200).send(queryCategories);
    } catch (error) {

        res.status(500).send('Server error');
    }
}

export async function postInCategories (req, res){
    const { name } = req.body;
    if(!name || name.length < 1 ){ return res.sendStatus(400) };

    try {
        const { rows: queryFindCategorie} = await clientpg.query(`SELECT * FROM categories WHERE name = $1`, [name]);
        
        if(queryFindCategorie.length > 0){
            return res.sendStatus(409);
        }

        const { rows: queryPutInCategorie} = await clientpg.query(`INSERT INTO categories (name) VALUES ($1)`, [name]);
        console.log(queryPutInCategorie);


        return res.sendStatus(201);
    } catch (error) {

        return res.status(500).send('Server error');
    }
}