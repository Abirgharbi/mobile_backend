import mongoose, { Document, Schema } from 'mongoose';
export interface Product extends Document {
    _id?: string;
    name: string;
    price: number;
    compare_at_price: number;
    productCost: number;
    totalRevenue: number;
    description: string;
    category: string;
    images?: string[];
    quantity: number;
    model?: string;
    thumbnail: string;
    ratingsAverage: number;
    ratingsCount: number;
    status: boolean;
    colors?: string[];
    discount: number;
}


export const productSchema = new Schema<Product>({
    // _id: { type: String, required: false },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    productCost: { type: Number, required: true },
    compare_at_price: { type: Number, required: true },
    description: { type: String, required: true },

    category: { type: String, required: true },

    images: [{ type: String, required: false }],
    thumbnail: { type: String, required: true },
    model: { type: String, required: false },

    ratingsAverage: { type: Number, required: false, default: 0 },
    ratingsCount: { type: Number, required: false, default: 0 },
    status: { type: Boolean, required: true, default: true },
    totalRevenue: { type: Number, required: true, default: 0 },

    quantity: { type: Number, required: true },
    colors: [{ type: String, required: false }],
    discount: { type: Number, required: false, default: 0 }
},
    {
        timestamps: true
    });


export const Product = mongoose.model<Product>('Product', productSchema);