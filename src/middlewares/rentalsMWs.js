import { clientpg } from "../db/postgres.js";

export async function verifyRental (req,res,next){
    const { id: idRentalToReturn } = req.params;

    const { rows: queryToVerifyRentalExists} = await clientpg.query(`SELECT * FROM rentals WHERE id = $1`, [idRentalToReturn]);
    if(queryToVerifyRentalExists.length < 1){
        return res.sendStatus(404);
    }
    if(queryToVerifyRentalExists[0].returnDate !== null){
        return res.sendStatus(400);
    }

    res.locals.rentalReturning = queryToVerifyRentalExists[0];

    next()
}

export async function verifyRentalToDelete (req,res,next){
    const { id: idRentalToReturn } = req.params;

    const { rows: queryToVerifyRentalExists} = await clientpg.query(`SELECT * FROM rentals WHERE id = $1`, [idRentalToReturn]);
    if(queryToVerifyRentalExists.length < 1){
        return res.sendStatus(404);
    }
    if(queryToVerifyRentalExists[0].returnDate === null){
        return res.sendStatus(400);
    }

    res.locals.rentalToDelete = queryToVerifyRentalExists[0];

    next()
}

export async function verifyNewRental (req, res, next){
    const { customerId } = req.body;

    try {
        const { rows: queryVerifyCustomer } = await clientpg.query('SELECT * FROM customers WHERE id = $1', [customerId]);

        if(queryVerifyCustomer.length !== 1){
            return res.sendStatus(400);
        }
        
        console.log('Passou na verificação do cliente');
        next();
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
