import mongoose, { Document, Schema } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export default interface Address extends Document {
    _id: string;
    city: string;
    country: string;
    state: string;
    zipCode: number;
    line1: string;
    line2: string;
    customerEmail: string;
}

export const addressSchema = new Schema<Address>({
    _id: { type: String, required: false },
    city: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String, required: false },
    zipCode: { type: Number, required: true },
    customerEmail: { type: String, required: true },
}, { timestamps: true })

export const Address = mongoose.model<Address>('Address', addressSchema);