import jwt from 'jsonwebtoken';
import { Customer, generateAuthToken } from '../models/customerModel';
import { sendMagicLink } from '../utils/sendMagicLink';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CustomError } from '../middleware/errorHandler';
import dotenv from 'dotenv';
dotenv.config();

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { email } = req.body;
        console.log(email);

        const customer = await Customer.findOne({ email });

        if (!customer) {
            return res.status(StatusCodes.CONFLICT).send({
                message: "Please create an account.",
            });
        }

        if (!customer.verified) {
            return res.status(StatusCodes.CONFLICT).send({
                message: "Verify your Account.",
            });
        }

       const magicToken = generateAuthToken(email, '1h');
       const link = `?token=${magicToken}`;
       await sendMagicLink(email, link, "Click the link below to sign in");

        const token = generateAuthToken(email, '30d');

        return res.status(StatusCodes.OK).json({ token, customer });
    } catch (error) {
        console.log(error);

        return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error logging in, please try again'));
    }
}

const register = async (req: Request, res: Response, next: NextFunction) => {

    try {
        console.log("abirrr")

        let { email, name } = req.body;
        const magicToken = generateAuthToken(email, '1h');
        const exist = await Customer.findOne({ email });
        const link = `?token=${magicToken}`;

        if (!exist) {
            await sendMagicLink(email, link, "Your account has been created. click the link below to confirm your email");

            const customer = await Customer.create({
                email,
                name,
            });
            const token = generateAuthToken(email, '30d');


            return res.status(StatusCodes.OK).json({ token, customer });

        } else {
            return res.status(StatusCodes.CONFLICT).send({ message: "Email already exists" });
        }
    } catch (error) {
        return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error registering customer'));
    }
}

const verifyMagicLink = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const token = req.query.token;

        if (!token) {
            return res.status(StatusCodes.UNAUTHORIZED).send({ message: "token not found" });
        }

        const { jwtSecret } = process.env;

        if (!jwtSecret) {
            throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'JWT secret not defined');
        }

        const decodedToken = jwt.verify(token.toString(), jwtSecret);

        const { email } = decodedToken as { email: string };

        if (await Customer.findOne({ email })) {
            const customer = await Customer.findOne({ email });
            if (!customer) {
                return res.status(StatusCodes.UNAUTHORIZED).send({ message: "customer does not exist" });
            } else {
                await Customer.findByIdAndUpdate(customer._id, { verified: true });

                return     res.json({ success: true });
            }
        } 
    } catch (error) {

        next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Invalid token'));
    }
}


const OauthRegister = async (req: Request, res: Response, next: NextFunction) => {

    try {

        let { email, name, image } = req.body;
        const customer = await Customer.find({ email });
        if (Object.keys(customer).length != 0) {

            const token = generateAuthToken(email, '30d');
            return res.status(StatusCodes.OK).send({ token, customer });

        } else {
            const customer = await Customer.create({ email, name, image, verified: true });

            const token = generateAuthToken(email, '30d');

            return res.status(StatusCodes.OK).send({ token, customer });
        }
    } catch (error) {
        next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error registering customer'));
    }
}



const OauthLogin = async (req: Request, res: Response, next: NextFunction) => {

    try {

        let { email } = req.body;

        const customer = await Customer.findOne({ email: email });

        const token = generateAuthToken(email, '30d');
        return res.status(StatusCodes.OK).send({ token, customer });

    } catch (error) {
        next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error registering customer'));
    }
}




// crypto.subtle.generateKey(
//     {
//         name: "HMAC",
//         hash: { name: "SHA-256" },
//     },
//     true,
//     ["sign", "verify"]
// )
//     .then(function (key) {
//         crypto.subtle.exportKey("jwk", key).then(exported => {
//             console.log(exported);
//         });
//     })

export { login, verifyMagicLink, register, OauthRegister, OauthLogin };