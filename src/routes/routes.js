import { Router } from 'express';
import { getCategories } from '../controllers/categoriesControll.js';

const router = Router();

router.get('/categories', getCategories);


router.get('/test', async (req, res) =>{
    res.status(200).send('Hello World');
});


export default router;