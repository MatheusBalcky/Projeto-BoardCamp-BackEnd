import { clientpg } from "../db/postgres.js";
import { gameSchema } from '../schemas/schemas.js';

export async function verifyNewGame(req, res, next) {
    const gameToInsert = req.body;
    const { name, categoryId } = req.body;

    const { error } = gameSchema.validate(gameToInsert);
    if (error) {
        return res.sendStatus(400);
    }

    try {
        const { rows: queryFindName } = await clientpg.query(`SELECT * FROM games WHERE name = $1`, [name]);
        if (queryFindName.length > 0) {
            return res.sendStatus(409)
        }

        const { rows: queryFindCategorie } = await clientpg.query(`SELECT * FROM categories WHERE id = $1`, [categoryId]);

        if (queryFindCategorie.length === 0) {
            return res.sendStatus(400)
        }

        next();
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }
}