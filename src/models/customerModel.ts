import mongoose, { Document, Schema } from 'mongoose';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export interface Customer extends Document {
    _id?: string;
    name: string;
    email: string;
    spend: number;
    verified: boolean;
    image: string;
    addressId: string;
    phone: string;
}


export const customerSchema = new Schema<Customer>({
    // _id: { type: String, required: false },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    verified: { type: Boolean, default: false },
    spend: { type: Number, required: false, default: 0 },
    image: { type: String, default: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww' },
    addressId: { type: String, required: false },
    phone: { type: String, required: false },
}, { timestamps: true });



export const generateAuthToken = function (email: string, expiresIn: string) {
    const { jwtSecret } = process.env;
    const token: string = jwt.sign({ email }, jwtSecret as string, {
        expiresIn: '1h',
    });
    return token;
}
export const Customer = mongoose.model<Customer>('Customer', customerSchema);