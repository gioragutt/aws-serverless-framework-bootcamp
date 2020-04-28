import AWS from 'aws-sdk';
import { InternalServerError } from 'http-errors';
import commonMiddlware from '../lib/commonMiddleware';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
  const { pathParameters: { id }, body: { amount } } = event;

  try {
    const { Attributes: updatedAuction } = await dynamodb.update({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key: { id },
      UpdateExpression: 'set highestBid.amount = :amount',
      ExpressionAttributeValues: {
        ':amount': amount,
      },
      ReturnValues: 'ALL_NEW',
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(updatedAuction),
    };
  } catch (e) {
    console.error(e);
    throw new InternalServerError(e);
  }
}

export const handler = commonMiddlware(placeBid);
