export type CartItem = {
    id: string; // _id of the product
    type: 'normal' | 'variable';
    title: {
        fa: string;
        en?: string;
    };
    thumbnail?: string;
    price: number;
    salePrice?: number;
    quantity: number; // quantity in cart
    stock: number; // available stock in product or combination
    oneItemPerOrder?: boolean;
    variation?: {
        id: number; // combination id
        options: Record<string, string>; // e.g., { "ورقه ای": "جعبه ای" }
    };
};