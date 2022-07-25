import { clientpg } from "../db/postgres.js";
import { clientSchema } from '../schemas/schemas.js';

export async function verifyNewCustomer (req, res, next){
    const clientData = req.body;

    const { error } = clientSchema.validate(clientData);
    if (error){
        return res.sendStatus(400)
    };

    try {
        const { rows: queryVerifyCpf } = await clientpg.query(`SELECT * FROM customers WHERE cpf = $1`, [clientData.cpf]);
        
        if(queryVerifyCpf.length > 0){
            return res.sendStatus(409)
        };

        next();
    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }

}