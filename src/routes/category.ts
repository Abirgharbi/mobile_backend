import { Router } from 'express';
import { addCategory, getCategories, getCategoriesName, getCategoryById } from '../controllers/category';
import { upload } from '../middleware/uploads';


const categoryRoute = Router();

//categoryRoute.post('/add', addCategory);
//new
categoryRoute.post('/add', upload.single('image'), addCategory);
categoryRoute.get('/get', getCategories);
categoryRoute.get('/getname', getCategoriesName);
categoryRoute.get('/get/:id', getCategoryById);


export default categoryRoute;