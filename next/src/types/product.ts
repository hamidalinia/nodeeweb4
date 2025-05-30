export type ProductCombination = {
    _id: number | string | null;
    price: number | string | null;
    salePrice?: number | string | null;
    options?: any;
    quantity?: number;
    is_stock?: boolean;
};

export type ProductType = {
    _id: string;
    title: {
        fa: string;
        en?: string;
    };
    slug: string;
    thumbnail?: string;
    quantity?: number;

    price: number | string | null;
    salePrice?: number | string | null;
    type: 'simple' | 'variable';
    combinations?: ProductCombination[];
    oneItemPerOrder?: boolean;
};



