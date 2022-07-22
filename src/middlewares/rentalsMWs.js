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