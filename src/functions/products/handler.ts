import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { default as products } from '../../utils/productList.json';
import cors from '@middy/http-cors';

export const getProductsList = middyfy(async (): Promise<APIGatewayProxyResult> => {
  return formatJSONResponse(products);
}).use(cors());

export const getProductsById = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters.id;
  const product = products.find(p => p.id === id);
  return formatJSONResponse(product);
}).use(cors());
