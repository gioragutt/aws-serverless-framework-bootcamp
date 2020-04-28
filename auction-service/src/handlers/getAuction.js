import AWS from 'aws-sdk';
import { InternalServerError, NotFound } from 'http-errors';
import commonMiddlware from '../lib/commonMiddleware';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuction(event, context) {
  const { id } = event.pathParameters;

  let auction;

  try {
    const result = await dynamodb.get({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key: { id },
    }).promise();

    auction = result.Item;
  } catch (e) {
    console.error(e);
    throw new InternalServerError(e);
  }

  if (!auction) {
    throw new NotFound(`Auction with ID=${id} not found`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddlware(getAuction);
