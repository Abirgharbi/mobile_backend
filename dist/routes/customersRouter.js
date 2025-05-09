"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerController_1 = require("../controllers/customerController");
const customerRoute = (0, express_1.Router)();
customerRoute.get('/get', 
//  protectAuth, 
customerController_1.getAllCustomers);
customerRoute.put('/update/:id', customerController_1.updateProfile);
customerRoute.delete('/delete/:id', 
//  protectAuth,
customerController_1.deleteCustomer);
customerRoute.get('/getVerifiedCustomers', 
//  protectAuth, 
customerController_1.getVerifiedCustomers);
customerRoute.post('/address', customerController_1.AddAddress);
customerRoute.get('/address/:email', customerController_1.getCustomerByAddress);
customerRoute.put('/spending/:id', customerController_1.updateSpending);
exports.default = customerRoute;
