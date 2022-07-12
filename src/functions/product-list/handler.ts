// import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
// import products from '../product-list/mock.json' assert {type: 'json'};

// import schema from './schema';

// const getProductList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const getProductList = async () => {
  return formatJSONResponse([
    {
      "count": 3,
      "description": "Short Product Description1",
      "id": "7567ec4b-b13c-48c5-9d45-fc73c48a80aa",
      "price": 2.2,
      "title": "ProductUpdated"
    },
    {
      "count": 2,
      "description": "Short Product Description2",
      "id": "7563ec4b-b13c-48c5-9d45-fc71c48a80aa",
      "price": 2,
      "title": "ProductUpdated2"
    }
  ]);
};

export const main = middyfy(getProductList);
