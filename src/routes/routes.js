import { Router } from 'express';
import { getCategories, postInCategories } from '../controllers/categoriesControll.js';

const router = Router();

router.get('/categories', getCategories);
router.post('/categories', postInCategories);


router.get('/test', async (req, res) =>{
    res.status(200).send('Hello World');
});


export default router;