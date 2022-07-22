import { wrapperQuery } from 'src/database/wrapper-query';
import { Product } from '../types/api-types';

export const getProducts = async (): Promise<Product[]> => {
    const products = await wrapperQuery('SELECT * FROM products INNER JOIN stocks ON products.id = stocks.product_id', []);
    return products;
};

export const getProductById = async (productId: string): Promise<Product> => {
    const products = await wrapperQuery(
        'SELECT * FROM products INNER JOIN stocks ON products.id = stocks.product_id WHERE id = $1',
        [productId]
    );
    return products;
};