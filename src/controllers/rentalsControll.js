import { clientpg } from "../db/postgres.js";
import dayjs from "dayjs";


export async function getRentals (req, res){
    const { customerId, gameId } = req.query;
    
    try {
        const { rows: queryGetRentals } = await clientpg.query(`SELECT * FROM rentals`);
        const { rows: queryGetCustomers } = await clientpg.query(`SELECT * FROM customers`);
        const { rows: queryGetGames } = await clientpg.query(`SELECT * FROM games`);
        const { rows: queryGetCategories } = await clientpg.query(`SELECT * FROM categories`);

        const gamesArr = queryGetGames.map( game =>{
            const objectReturn = {
                ...game,
                categoryName: queryGetCategories.find( categ => categ.id === game.categoryId).name,
            }

            delete objectReturn.image; delete objectReturn.stockTotal; delete objectReturn.pricePerDay;
            return objectReturn;
        })

        const rentalsArr = queryGetRentals.map( rental =>{
            const objectReturn =  {
                ...rental,
                customer: queryGetCustomers.find( customer => customer.id === rental.customerId),
                game: gamesArr.find(game => game.id === rental.gameId)
            }
            delete objectReturn.customer.phone; delete objectReturn.customer.cpf; delete objectReturn.customer.birthday;

            return objectReturn
        });

        if(customerId){
            const rentalsByCustomerId = rentalsArr.filter( rental => rental.customerId === parseInt(customerId));
            return res.status(200).send(rentalsByCustomerId);
        }

        if(gameId){
            const rentalsByGameId = rentalsArr.filter( rental => rental.gameId === parseInt(gameId));
            return res.status(200).send(rentalsByGameId);
        }

        return res.status(200).send(rentalsArr);

    } catch (error) {

        console.log(error);
        res.sendStatus(500);
    }

    
}

export async function insertRentals (req, res){
    const { customerId, gameId, daysRented } = req.body;
    
    try {
        const { rows: queryVerifyCustomer } = await clientpg.query('SELECT * FROM customers WHERE id = $1', [customerId]);
        const { rows: queryFindGame } = await clientpg.query('SELECT * FROM games WHERE id = $1', [gameId]);
        const { rows: queryCountGameRentals } = await clientpg.query('SELECT COUNT ("gameId") FROM rentals WHERE "gameId" = $1',[gameId]);
        
        const amountRented = parseInt(queryCountGameRentals[0].count);
        console.log(amountRented);
        const gameFounded = queryFindGame[0];

        if(queryVerifyCustomer.length !== 1 || queryFindGame.length !== 1 || daysRented < 1 || amountRented >= gameFounded.stockTotal){
            return res.sendStatus(400);
        }
        
        const originalPrice = gameFounded.pricePerDay * daysRented;

        const values = [
            customerId,
            gameId,
            dayjs().format("DD-MM-YYYY"), // rentDate
            daysRented,
            null, // returnDate
            originalPrice,
            null, // delayFee
            ];
        
        
        await clientpg.query(`INSERT INTO rentals
                            ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
                            VALUES ($1, $2, $3, $4, $5, $6, $7)`, values);
        
        return res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }   
}

export async function returnRental (req, res){
    const { rentalReturning } = res.locals;
    
    try {
        const daysPassed = (dayjs().diff(dayjs(rentalReturning.rentDate), 'd'))
        const currentDate = dayjs().format('DD-MM-YYYY');

        if(daysPassed <= rentalReturning.daysRented){

            await clientpg.query(`UPDATE rentals SET "returnDate" = $1 WHERE id = $2`, [currentDate, rentalReturning.id]);
    
            return res.sendStatus(200)
        }

        const pricePerDay = rentalReturning.originalPrice / rentalReturning.daysRented ;
        const fee = (daysPassed - rentalReturning.daysRented) * pricePerDay;

        await clientpg.query(`UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3`, [currentDate, fee, rentalReturning.id]);

        return res.sendStatus(200);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

    



    
}
