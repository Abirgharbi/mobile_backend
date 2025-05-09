import mongoose, { Schema, Document } from 'mongoose';

// Interface should match the schema exactly
export interface IReview extends Document {
  comment: string;
  rating: number;
  customerName: string;
  customerImage: string;
  productId: string; // ← Consistent with schema type
}

const reviewSchema = new Schema<IReview>(
  {
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
    customerName: { type: String, required: false },
    customerImage: { type: String, required: false },
    productId: { type: String, required: true }, // ← String for consistency
  },
  {
    timestamps: true,
  }
);

export const Review = mongoose.model<IReview>('Review', reviewSchema);
