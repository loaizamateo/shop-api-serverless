import { handlerPath } from '@libs/handler-resolver';

export const getProductsList = {
  handler: `${handlerPath(__dirname)}/handler.getProductsList`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        cors: {
          origin: '*'
        },
        responses: {
          '200': {
            description: 'Success response',
            bodyType: 'Product'
          }
        }
      },
    },
  ],
};

export const getProductsById = {
  handler: `${handlerPath(__dirname)}/handler.getProductsById`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{id}',
        cors: {
          origin: '*'
        },
        responses: {
          '200': {
            description: 'Success response',
            bodyType: 'Product'
          }
        }
      },
    },
  ],
};
