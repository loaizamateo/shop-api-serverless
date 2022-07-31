import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatErrorResponse, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { HTTPError } from "src/errors/http-error.class";
import { createProduct, getProducts, getProductById } from '../../services/products';
import { Product } from "src/types/api-types";

export const createProducts = middyfy(async (event): Promise<APIGatewayProxyResult> => {
  console.log('createProducts', event);
  try {
    const { title, description, price, count } = event;
    if (!title)
      throw new HTTPError(400, 'title is missing');
    if (!description)
      throw new HTTPError(400, 'description is missing');
    if (!price)
      throw new HTTPError(400, 'price is missing');
    if (!count)
      throw new HTTPError(400, 'count is missing');

    const product = await createProduct(event as unknown as Product);
    return formatJSONResponse(product);
  } catch (e) {
    if (e instanceof HTTPError) {
      return formatErrorResponse(e.statusCode, e.message);
    }

    return formatErrorResponse(500, `Failed to create product: ${e.message}`);
  }
});

export const getProductsList = middyfy(async (event): Promise<APIGatewayProxyResult> => {
  console.log('getProductsList', event);
  try {
    const products = await getProducts();
    return formatJSONResponse(products);
  } catch (e) {
    if (e instanceof HTTPError) {
      return formatErrorResponse(e.statusCode, e.message);
    }

    return formatErrorResponse(500, `Failed to get products: ${e.message}`);
  }
})

export const getProductsById = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('getProductsById', event);
  try {
    const id = event.pathParameters.id;
    if (!id) {
      throw new HTTPError(400, 'Product id is not correct');
    }

    const product = await getProductById(id);

    if (!product) {
      throw new HTTPError(404, 'Product not found');
    }
    return formatJSONResponse(product);
  } catch (error) {
    if (error instanceof HTTPError) {
      return formatErrorResponse(error.statusCode, error.message);
    }

    return formatErrorResponse(500, error.message);
  }
})
