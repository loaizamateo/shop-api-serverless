// import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { default as products } from '../product-list/productList.json';

// import schema from './schema';

// const getProductList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const getProductList = async () => {
  return formatJSONResponse(products);
};

export const main = middyfy(getProductList);
