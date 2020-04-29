import AWS from 'aws-sdk';

export const dynamodb = new AWS.DynamoDB.DocumentClient();

export const TableName = process.env.AUCTIONS_TABLE_NAME;
