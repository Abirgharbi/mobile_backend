import mongoose, { Document, Schema } from 'mongoose';

export interface Category extends Document {
    name: string;
    image: string;
}


export const categorySchema = new Schema<Category>({
    name: { type: String, required: true },
    image: { type: String, required: true },
},
    {
        timestamps: true
    });


export const Category = mongoose.model<Category>('Category', categorySchema);


