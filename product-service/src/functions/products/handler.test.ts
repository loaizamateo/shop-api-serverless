// import { getProductsList } from './handler';
// import { default as products } from '../../utils/productList.json';

// jest.mock('@libs/api-gateway', () => ({
//     formatJSONResponse: (arg) => arg
// }));

// jest.mock('@libs/lambda', () => ({
//     middyfy: (arg) => arg
// }));

// describe('getProductList', () => {
//     it('should return productList', async () => {
//         // Act
//         const result: any = await getProductsList('');

//         console.log('result', result);

//         // Assert
//         expect(result.data).toEqual(products);
//     });
// });