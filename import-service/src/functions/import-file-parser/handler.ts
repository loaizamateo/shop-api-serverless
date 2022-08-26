import { middyfy } from "@libs/lambda";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import {
  SQSClient,
  SendMessageCommand,
  GetQueueUrlCommand,
} from "@aws-sdk/client-sqs";
import type { S3Event } from "aws-lambda";
import { formatJSONResponse } from "@libs/api-gateway";
const csv = require('csv-parser')

const importFileParser = async (event: S3Event) => {
  console.log(event);

  const region = process.env.AWS_CLIENT_REGION;
  const file = event.Records[0];
  const client = new S3Client({ region });
  const contentParsed = [];

  // Getting file from S3
  const fileStream = await client.send(
    new GetObjectCommand({
      Bucket: file.s3.bucket.name,
      Key: file.s3.object.key,
    })
  );

  // Logging and send it to sqs for parse it
  fileStream.Body.pipe(csv())
    .on("data", (data) => contentParsed.push(data))
    .on("end", async () => {
      const clientSqs = new SQSClient({ region });

      // Getting url of the current queue
      const queueUrl = await clientSqs.send(
        new GetQueueUrlCommand({
          QueueName: process.env.AWS_CLIENT_SQS_CATALOG_ITEMS,
        })
      );

      await clientSqs.send(
        new SendMessageCommand({
          QueueUrl: queueUrl.QueueUrl,
          MessageBody: JSON.stringify(contentParsed),
        })
      );
    });

  // Moving to parsed folder
  await client.send(
    new CopyObjectCommand({
      Bucket: file.s3.bucket.name,
      CopySource: `${file.s3.bucket.name}/${file.s3.object.key}`,
      Key: file.s3.object.key.replace("uploaded/", "parsed/"),
    })
  );

  // Delete old object
  await client.send(
    new DeleteObjectCommand({
      Bucket: file.s3.bucket.name,
      Key: file.s3.object.key,
    })
  );

  return formatJSONResponse({
    data: event.Records,
    // event,
  });
}

export const main = middyfy(importFileParser);