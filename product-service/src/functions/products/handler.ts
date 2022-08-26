import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatErrorResponse, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { HTTPError } from "src/errors/http-error.class";
import { createProduct, getProducts, getProductById } from '../../services/products';
import { Product } from "src/types/api-types";
import {
  SQSClient,
  DeleteMessageCommand,
  GetQueueUrlCommand,
} from "@aws-sdk/client-sqs";

import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

export const catalogBatchProcess = async (event) => {
  const region = process.env.AWS_REGION;
  console.log(event);

  const message = event.Records[0];
  const records = JSON.parse(message.body);
  const insertQueries = [];

  console.log(`Inserting next records ${records}`);

  records.forEach((record, idx) => {
    const { title, description, price, count } = record;
    const errors: string[] = [];

    if (!title || !description) {
      errors.push(
        `Record: "${idx}" Title/Description is mandatory ${JSON.stringify(
          record
        )}`
      );
    }

    if (isNaN(price)) {
      errors.push(
        `Record: "${idx}" Price must be numeric: ${JSON.stringify(record)}`
      );
    }

    if (errors.length > 0) {
      console.log(errors.join(","));
    } else {
      insertQueries.push(
        createProduct({
          title,
          description,
          price,
          count,
        })
      );
    }
  });

  await Promise.allSettled(insertQueries).then(async (results) => {
    console.log(`Inserts done, results: ${JSON.stringify(results)}`);

    const clientSqs = new SQSClient({ region });
    const clientSns = new SNSClient({ region });

    const totalPrice = results
      .map((result) => result.status === "fulfilled" && result.value.price)
      .reduce((a, b) => a + b, 0);

    try {
      const queueObj = await clientSqs.send(
        new GetQueueUrlCommand({
          QueueName: process.env.AWS_CLIENT_SQS_CATALOG_ITEMS,
        })
      );

      await clientSqs.send(
        new DeleteMessageCommand({
          QueueUrl: queueObj.QueueUrl,
          ReceiptHandle: message.receiptHandle,
        })
      );

      console.log(`Message ${message.messageId} deleted`);

      await clientSns.send(
        new PublishCommand({
          TopicArn: `arn:aws:sns:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:${process.env.AWS_CLIENT_SNS_CREATED_PRODUCTS}`,
          Subject: "New products were added to the database",
          Message: `Hi! New products have been added to the store! \n ${JSON.stringify(
            results
          )}`,
          MessageAttributes: {
            totalPrice: {
              DataType: "Number",
              StringValue: totalPrice.toString(),
            },
          },
        })
      );
    } catch (err) {
      console.log(err);
    }
  });
};

export const main = catalogBatchProcess;

export const createProducts = middyfy(async (event): Promise<APIGatewayProxyResult> => {
  console.log('createProducts', event);
  try {
    const { title, description, price, count } = event.body;
    if (!title)
      throw new HTTPError(400, 'title is missing');
    if (!description)
      throw new HTTPError(400, 'description is missing');
    if (!price)
      throw new HTTPError(400, 'price is missing');
    if (!count)
      throw new HTTPError(400, 'count is missing');

    const product = await createProduct(event.body as unknown as Product);
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
