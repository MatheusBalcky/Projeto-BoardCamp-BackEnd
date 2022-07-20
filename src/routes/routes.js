import { Router } from 'express';
import { getCategories, postInCategories } from '../controllers/categoriesControll.js';
import { getGames, insertGame } from '../controllers/gamesControll.js';


const router = Router();

// & ROUTES CATEGORIES
router.get('/categories', getCategories);
router.post('/categories', postInCategories);

// & ROUTES GAMES
router.get('/games', getGames);
router.post('/games', insertGame);


router.get('/test', async (req, res) =>{
    res.status(200).send('Hello World');
});


export default router;