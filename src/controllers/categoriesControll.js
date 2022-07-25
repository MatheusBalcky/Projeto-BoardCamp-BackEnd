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
    try {
        const { rows: queryPutInCategorie} = await clientpg.query(`INSERT INTO categories (name) VALUES ($1)`, [name]);

        return res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}