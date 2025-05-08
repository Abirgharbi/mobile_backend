import express from 'express';
import { Customer } from '../models/customerModel';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CustomError } from '../middleware/errorHandler';
import { Address } from '../models/addressModel';
import { ObjectId } from 'mongodb';

const getAllCustomers = async (req: Request, res: Response, next: NextFunction) => {

    try {
        var perPage = 5;
        var page: number = Number(req.query.page);
        page > 0 ? page : page = 0;
        
        const [count, customers] = await Promise.all([
            Customer.countDocuments(),
            Customer.find()
                .limit(perPage)
                .skip(perPage * page)
        ]);

        return res.status(StatusCodes.OK).send({ count, customers });
    } catch (error) {
        return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error getting customers, please try again'));
    }
}

const updateProfile = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let { email, name, image, phone } = req.body;
    try {
        await Customer.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: { email, name, image, phone },
            });
        return res.status(StatusCodes.OK).send({ message: 'Profile updated successfully' });
    } catch (err) {
        next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error updating Profile'));
    }
}

const deleteCustomer = async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    try {
        const id = new ObjectId(req.params.id);
        const customer = await Customer.deleteOne(id);
        console.log(customer);

        return res.status(StatusCodes.OK).send({ message: 'Customer deleted successfully' });
    } catch (error) {
        next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error deleting customer'));
    }
}

const getVerifiedCustomers = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const len = await Customer.find({ verified: true });
        const verifiedCustomers = len.length;
        const count = await Customer.find();
        const unVerifiedCustomers = count.length - verifiedCustomers;
        return res.status(StatusCodes.OK).send({ verifiedCustomers, unVerifiedCustomers });
    } catch (error) {
        next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error getting active customers'));
    }
}

const AddAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { city, country, state, zipCode, line1, line2, customerEmail } = req.body;
        const address = await Address.findOneAndUpdate(
            { customerEmail },
            { city, country, state, zipCode, line1, line2, customerEmail },
            { upsert: true, new: true }
        );

        const addressId = address._id;

        await Customer.findOneAndUpdate(customerEmail, { addressId });

        return res.status(StatusCodes.OK).send(address);
    } catch (error) {
        console.log(error);
        next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'internal server error'));
    }
};

const getCustomerByAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.params;
        const address = await Address.find({ customerEmail: email });
        return res.status(StatusCodes.OK).send({ address });
    } catch (error) {
        next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'internal server error'));
    }
};

const updateSpending = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { spend } = req.body;
        const c = await Customer.updateOne(
            { id },
            { $inc: { spend } },
            { new: true }
        );
        console.log(c);
        return res.status(StatusCodes.OK).send({ message: 'spend updated successfully' });
    } catch (error) {
        next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'internal server error'));
    }
};


export { getAllCustomers, updateProfile, deleteCustomer, getVerifiedCustomers, AddAddress, getCustomerByAddress, updateSpending };