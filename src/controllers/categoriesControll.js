import { clientpg } from '../db/postgres.js';

export async function getCategories (req, res){
    try {
        const { rows: queryCategories} = await clientpg.query('SELECT * FROM categories');

        res.status(200).send(queryCategories);
    } catch (error) {

        res.status(500).send('Server error');
    }
}