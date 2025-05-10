import { Router } from 'express';
import { protectAuth } from '../middleware/protectAuth';
import { upload } from '../middleware/uploads';
import { addProduct,getProducts, getProductById, getFiltredProducts, getRecentProducts, getPopularProducts, getProductsByCategory, getBestSellingProducts, getDiscountedProducts, checkProductsInStock, updateProductRating} from '../controllers/product';

const productRoute = Router();

//new
productRoute.post(
    '/add-product',
    upload.fields([
      { name: 'images', maxCount: 5 },
      { name: 'thumbnail', maxCount: 1 }
    ]),
    addProduct
  );


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

export default productRoute;
