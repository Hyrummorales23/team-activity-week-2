export type Item = {
    itemId: string;
    productName: string;
    productDescription: string;
    productPrice: number;
    productPicture: string;
    category: 'jewelry' | 'art' | 'clothing' | 'home_decor' | 'toys' | 'books' | 'electronics' | 'other';
    userId: string;
    createdAt: string;
}

export type Rating = {
    ratingId: string;
    productId: string;
    userId: string;
    ratingValue: number;
    comment: string;
}

export type User = {
    userId: string;
    type: 'customer' | 'seller';
    name: string;
    email: string;
    passwordHash: string;
    profilePicture: string;
}

export type Sale = {
    saleId: string;
    productId: string;
    userId: string;
    quantity: number;
    totalPrice: number;
    saleDate: string;
}