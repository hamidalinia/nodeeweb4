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



export type Combination = {
    id: number;
    options: Record<string, string>;
    in_stock: boolean;
    price: number;
    quantity: number;
    discounted_price?: number;
};

export type OptionValue = {
    id: number;
    name: string;
    image?: string;
};

export type Option = {
    name: string;
    values: OptionValue[];
    isDisabled?: boolean;
};

export type Specification = {
    key: string;
    value: string;
};

export type ProductData = {
    _id: string;
    title: { fa: string; en: string };
    description: { fa: string };
    specifications?: Specification[];
    usage_guide?: { fa: string };
    thumbnail?: string;
    photos?: string[];
    combinations?: Combination[];
    options?: Option[];
    excerpt?: { fa: string };
    in_stock?: boolean;
    brand?: string;
    category?: string;
};

export type HomeProps = {
    theme?: any;
    productData?: ProductData;
    mode: 'light' | 'dark';
    toggleMode: () => void;
};
