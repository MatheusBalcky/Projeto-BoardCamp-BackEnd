import { Router } from 'express';
import { getCategories, postInCategories } from '../controllers/categoriesControll.js';
import { verifyNewCategorie } from '../middlewares/categoriesMWs.js';

import { getGames, insertGame } from '../controllers/gamesControll.js';
import { verifyNewGame } from '../middlewares/gamesMWs.js';

import { getClients, getClientsById, insertClients, updateClients } from '../controllers/clientsControll.js';
import { verifyNewCustomer } from '../middlewares/clientsMWs.js';

import { getRentals, insertRentals, returnRental, deleteRental} from '../controllers/rentalsControll.js';
import { verifyRental, verifyRentalToDelete, verifyNewRental } from '../middlewares/rentalsMWs.js';





const router = Router();

// & ROUTES CATEGORIES
router.get('/categories', getCategories);
router.post('/categories', verifyNewCategorie,postInCategories);

// & ROUTES GAMES
router.get('/games', getGames);
router.post('/games', verifyNewGame ,insertGame);

// & ROUTES CLIENTS
router.get('/customers', getClients);
router.get('/customers/:id', getClientsById);
router.post('/customers', verifyNewCustomer, insertClients);
router.put('/customers/:id', updateClients);

// & ROUTES RENTALS
router.get('/rentals', getRentals);
router.post('/rentals', verifyNewRental, insertRentals);
router.post('/rentals/:id/return', verifyRental, returnRental);
router.delete('/rentals/:id', verifyRentalToDelete, deleteRental);



router.get('/test', async (req, res) =>{ res.status(200).send('Hello World');});


export default router;