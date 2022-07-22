import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatErrorResponse, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { default as products } from '../../utils/productList.json';
import cors from '@middy/http-cors';
import { HTTPError } from "src/errors/http-error.class";

export const getProductsList = middyfy(async (): Promise<APIGatewayProxyResult> => {
  try {
    return formatJSONResponse(products);
  } catch (e) {
    if (e instanceof HTTPError) {
      return formatErrorResponse(e.statusCode, e.message);
    }

    return formatErrorResponse(500, `Failed to get products: ${e.message}`);
  }
}).use(cors());

export const getProductsById = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters.id;
    if (!id) {
      throw new HTTPError(400, 'Product id is not correct');
    }
    const product = products.find(p => p.id === id);
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
}).use(cors());
