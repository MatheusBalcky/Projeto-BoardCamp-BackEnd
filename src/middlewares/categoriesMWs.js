import { clientpg } from "../db/postgres.js";

export async function verifyNewCategorie (req, res, next){
    const { name } = req.body;
    if(!name || name.length < 1 ){
        return res.sendStatus(400)
    }

    try {
        const { rows: queryFindCategorie} = await clientpg.query(`SELECT * FROM categories WHERE name = $1`, [name]);
        
        if(queryFindCategorie.length > 0){
            return res.sendStatus(409);
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}