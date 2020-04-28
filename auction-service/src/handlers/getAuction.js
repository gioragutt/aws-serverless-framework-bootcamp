import AWS from 'aws-sdk';
import { getAuctionById } from '../lib/auctions';
import commonMiddlware from '../lib/commonMiddleware';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuction(event, context) {
  const { id } = event.pathParameters;
  const auction = await getAuctionById(dynamodb, id);

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddlware(getAuction);

