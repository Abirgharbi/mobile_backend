import { Router } from 'express';
import { getAllCustomers, updateProfile, deleteCustomer, getVerifiedCustomers, AddAddress, getCustomerByAddress, updateSpending } from '../controllers/customerController';

const customerRoute = Router();

customerRoute.get('/get',
//  protectAuth, 
 getAllCustomers);
customerRoute.put('/update/:id', updateProfile);
customerRoute.delete('/delete/:id',
//  protectAuth,
  deleteCustomer);
customerRoute.get('/getVerifiedCustomers',
//  protectAuth, 
 getVerifiedCustomers);
customerRoute.post('/address', AddAddress);
customerRoute.get('/address/:email', getCustomerByAddress);
customerRoute.put('/spending/:id', updateSpending);

export default customerRoute;
