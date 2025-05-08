import { Router } from 'express';
import { protectAuth } from '../middleware/protectAuth';

import { addProduct, updateProduct, deleteProduct, getProducts, getProductById, getFiltredProducts, getRecentProducts, getPopularProducts, getProductsByCategory, getBestSellingProducts, getDiscountedProducts, checkProductsInStock, updateProductRating, updateProductAfterSelling,getTotalMoneyEarned ,updateProductStatus,calculateTotalRevenue} from '../controllers/product';

const productRoute = Router();

productRoute.post('/add', addProduct);
productRoute.put('/update/:id', protectAuth, updateProduct);
productRoute.delete('/delete/:id', protectAuth, deleteProduct);
productRoute.get('/get', getProducts);
productRoute.get('/get/:id', getProductById);
productRoute.get('/filter', getFiltredProducts);

productRoute.get('/recent', getRecentProducts);
productRoute.get('/popular', getPopularProducts);

productRoute.get('/product-by-category/:id', getProductsByCategory);
productRoute.get('/best-selling', getBestSellingProducts);
productRoute.get('/discount', getDiscountedProducts);
productRoute.post('/check-availability', checkProductsInStock);
productRoute.put('/update-rating/:id', updateProductRating);
productRoute.put('update-after-sell/:id', updateProductAfterSelling);
productRoute.get('/total-money-earned', getTotalMoneyEarned);
productRoute.put('/update-status/:id', updateProductStatus);
productRoute.get('/total-revenue', calculateTotalRevenue);

export default productRoute;
