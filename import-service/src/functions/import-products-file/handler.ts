import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { S3 } from 'aws-sdk';
require('dotenv').config({ path: '../../.env' });

const importProductsFile = async (event: APIGatewayProxyEvent) => {

  const s3 = new S3({ region: process.env.REGION });

  if (!event.queryStringParameters.name) {
    return {
      body: 'name its required'
    }
  }

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `uploaded/${event.queryStringParameters.name}`,
    Expires: 3600,
    ContentType: 'text/csv'
  };

  try {
    const url = await s3.getSignedUrl('putObject', params);
    return formatJSONResponse({ link: url});
  } catch (error) {
    console.error('getSignedUrl failed', error);
    return {
      statusCode: 500,
      body: 'name its required'
    };
  }

};

export const main = middyfy(importProductsFile);
