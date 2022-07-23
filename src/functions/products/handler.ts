import { APIGatewayEvent, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatErrorResponse, formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { HTTPError } from "src/errors/http-error.class";
import { createProduct, getProducts, getProductById } from '../../services/products';
import { Product } from "src/types/api-types";
import CreateProduct from "src/dtos/CreateProductDto";
import schema from "./schema";

const main: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event): Promise<APIGatewayProxyResult> => {
  try {
    const product = await createProduct(event.body as unknown as Product);
    return formatJSONResponse(product);
  } catch (e) {
    if (e instanceof HTTPError) {
      return formatErrorResponse(e.statusCode, e.message);
    }

    return formatErrorResponse(500, `Failed to create product: ${e.message}`);
  }
};

export const createProducts = middyfy(main);

export const getProductsList = middyfy(async (): Promise<APIGatewayProxyResult> => {
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
