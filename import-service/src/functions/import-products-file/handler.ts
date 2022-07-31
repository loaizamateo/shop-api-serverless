import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { S3 } from 'aws-sdk';
import { extractFile } from 'src/utils';
import schema from './schema';
require('dotenv').config({ path: '../../.env' });
const BUCKET = process.env.BUCKET_NAME;

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const { name } = event.queryStringParameters;

  const s3 = new S3();

  try {
    const { filename, data } = extractFile(event)
    const s3Params = {
      Bucket: process.env.BUCKET_NAME,
      Key: filename,
      Prefix: 'uploaded/',
      Delimiter: '/',
      ACL: 'public-read',
      Body: data
    };

    await s3.putObject(s3Params).promise();

    return formatJSONResponse({ link: `https://${BUCKET}.s3.amazonaws.com/${filename}` });
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.stack })
    }
  }

};

export const main = middyfy(importProductsFile);
