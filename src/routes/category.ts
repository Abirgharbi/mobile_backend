import { Router } from 'express';
import { addCategory, updateCategory, deleteCategory, getCategories, getCategoriesName, getCategoryById } from '../controllers/category';


const categoryRoute = Router();

categoryRoute.post('/add', addCategory);
categoryRoute.put('/update/:id', updateCategory);
categoryRoute.delete('/delete/:id', deleteCategory);
categoryRoute.get('/get', getCategories);
categoryRoute.get('/getname', getCategoriesName);
categoryRoute.get('/get/:id', getCategoryById);


export default categoryRoute;