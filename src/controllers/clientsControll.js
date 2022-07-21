import { clientpg } from '../db/postgres.js';
import { clientSchema } from '../schemas/schemas.js';

export async function getClients (req, res){
    let { cpf } = req.query;

    try {
        if(cpf){
            cpf = cpf + '%';
            const { rows: queryClients } = await clientpg.query(`SELECT * FROM customers WHERE cpf LIKE $1`, [cpf]);
            return res.status(200).send(queryClients);
        }


        const { rows: queryClients } = await clientpg.query(`SELECT * FROM customers`);

        res.status(200).send(queryClients);
    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }

}

export async function getClientsById (req, res){
    const { id } = req.params;
    try {
        const { rows: queryClients } = await clientpg.query(`SELECT * FROM customers WHERE id = $1`, [id]);

        if(queryClients.length === 0){
            return res.sendStatus(404);
        }

        return res.status(200).send(queryClients[0]);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function insertClients (req, res){
    const clientData = req.body;
    const { error } = clientSchema.validate(clientData);
    
    if (error){ return res.sendStatus(400) };

    try {
        const { rows: queryVerifyCpf } = await clientpg.query(`SELECT * FROM customers WHERE cpf = $1`, [clientData.cpf]);
        if(queryVerifyCpf.length > 0){  return res.sendStatus(409)  };

        await clientpg
        .query(`INSERT INTO customers (name, phone, cpf, birthday)
                VALUES ($1, $2, $3, $4)`, [clientData.name, clientData.phone, clientData.cpf, clientData.birthday]);

        return res.sendStatus(200);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

    
}

export async function updateClients (req, res){ // & WITH A LITTLE BUG
    // const { id } = req.params;
    // const clientUpdateData = req.body;

    // const { error } = clientSchema.validate(clientUpdateData);
    // if (error){ return res.sendStatus(400) };

    // try {
    //     const query = `
    //     SELECT * FROM customers
    //     WHERE cpf = $1
    //     `

    //     const { rows: queryVerifyCpf } = await clientpg.query(`SELECT * FROM customers WHERE cpf = $1`, [clientUpdateData.cpf]);
    //     if(queryVerifyCpf.length > 0){  return res.sendStatus(409)  };

    //     await clientpg.query(`UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5`,
    //     [clientUpdateData.name, clientUpdateData.phone, clientUpdateData.cpf, clientUpdateData.birthday, id])

    //     return res.sendStatus(200);
    // } catch (error) {
    //     console.log(error);
    //     res.sendStatus(500);
    // }
}