import { Router } from 'express';
import { getCategories, postInCategories } from '../controllers/categoriesControll.js';
import { getClients, getClientsById, insertClients, updateClients } from '../controllers/clientsControll.js';
import { getGames, insertGame } from '../controllers/gamesControll.js';


const router = Router();

// & ROUTES CATEGORIES
router.get('/categories', getCategories);
router.post('/categories', postInCategories);

// & ROUTES GAMES
router.get('/games', getGames);
router.post('/games', insertGame);

// & ROUTES CLIENTS
router.get('/customers', getClients);
router.get('/customers/:id', getClientsById);
router.post('/customers', insertClients);
//router.put('/customers/:id', updateClients);





router.get('/test', async (req, res) =>{ res.status(200).send('Hello World');});


export default router;