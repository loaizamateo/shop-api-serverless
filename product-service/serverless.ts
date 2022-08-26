import type { AWS } from '@serverless/typescript';

import { createProducts, getProductsList, getProductsById, catalogBatchProcess } from '@functions/products';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  useDotenv: true,
  frameworkVersion: '3',
  plugins: [
    'serverless-auto-swagger',
    'serverless-offline',
    'serverless-esbuild',
    'serverless-dotenv-plugin'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["sqs:*"],
        Resource: [
          {
            "Fn::GetAtt": ["catalogItemsQueue", "Arn"],
          },
        ],
      },
      {
        Effect: "Allow",
        Action: ["sns:*"],
        Resource: [
          `arn:aws:sns:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:${process.env.AWS_CLIENT_SNS_CREATED_PRODUCTS}`,
        ],
      },
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: {
    createProducts,
    getProductsList,
    getProductsById,
    catalogBatchProcess
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: process.env.AWS_CLIENT_SQS_CATALOG_ITEMS,
        },
      },
      createProductTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: process.env.AWS_CLIENT_SNS_CREATED_PRODUCTS,
        },
      },
      sendMailSub: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Protocol: "email",
          TopicArn: `arn:aws:sns:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:${process.env.AWS_CLIENT_SNS_CREATED_PRODUCTS}`,
          Endpoint: process.env.EMAIL_CREATED_PRODUCT,
        },
      },
      sendMailAltSub: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Protocol: "email",
          TopicArn: `arn:aws:sns:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:${process.env.AWS_CLIENT_SNS_CREATED_PRODUCTS}`,
          Endpoint: process.env.EMAIL_CREATED_PRODUCT2,
          FilterPolicy: {
            totalPrice: [{ numeric: ["<", 200] }],
          },
        },
      },
    },
  },
  package: { individually: true },
  custom: {
    autoswagger: {
      useStage: true
    },
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: true,
      exclude: ['aws-sdk', 'pg-native'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    }
  },
};

module.exports = serverlessConfiguration;
