import { wrapperQuery } from 'src/database/wrapper-query';
import { Product, Stock } from '../types/api-types';
import { v4 as UUID } from 'uuid';

export const createProduct = async (body: Product): Promise<Product | Stock> => {
    
    const query = 'INSERT INTO products (id, title, description, price) VALUES($1, $2, $3, $4) RETURNING *';
    const values = [UUID(),body.title, body.description, body.price];
    const product: Product = await wrapperQuery(query, values);
    const stock = await insertStock(product.id, body.count);
    
    return {
        ...product, 
        count: stock.count
    };
};

export const getProducts = async (): Promise<Product[]> => {
    const products = await wrapperQuery('SELECT * FROM products INNER JOIN stocks ON products.id = stocks.product_id', []);
    return products;
};

export const getProductById = async (productId: string): Promise<Product> => {
    const product = await wrapperQuery(
        'SELECT * FROM products INNER JOIN stocks ON products.id = stocks.product_id WHERE id = $1',
        [productId]
    );
    return product;
};

const insertStock = async (productId: string, count: number): Promise<Stock> => {
    const query = 'INSERT INTO stocks (product_id, count) VALUES($1, $2) RETURNING count';
    const values = [productId, count];
    const stock = await wrapperQuery(query, values);
    return stock;
}