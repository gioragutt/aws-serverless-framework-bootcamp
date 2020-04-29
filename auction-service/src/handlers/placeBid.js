import { Forbidden, InternalServerError } from 'http-errors';
import commonMiddlware from '../lib/commonMiddleware';
import { dynamodb, getAuctionById } from '../lib/db';

async function placeBid(event) {
  const { pathParameters: { id }, body: { amount } } = event;

  const auction = await getAuctionById(id);

  if (auction.highestBid.amount >= amount) {
    throw new Forbidden(`Your bid must be higher than ${auction.highestBid.amount}!`);
  }

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