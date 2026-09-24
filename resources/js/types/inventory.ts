export interface ItemCategory {
    id: number | string;
    name: string;
    description?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface ItemVariant {
    id: string;
    item_id: string;
    name: string;
    created_at?: string;
    updated_at?: string;
}

export interface Item {
    id: string;
    item_category_id: number | string;
    name: string;
    code: string;
    unit: string;
    minimal_quantity: number;
    description?: string | null;
    picture?: string | null;
    picture_url?: string | null;
    created_at?: string;
    updated_at?: string;
    item_category?: ItemCategory;
    variants?: ItemVariant[];
}
