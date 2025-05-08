
export interface Product {
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