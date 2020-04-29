import { Forbidden, InternalServerError } from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';
import { dynamodb, TableName } from '../lib/db/db';
import { getAuctionById } from '../lib/db/getAuctionById';

async function placeBid(event) {
  const { pathParameters: { id }, body: { amount } } = event;

  const auction = await getAuctionById(id);

  if (auction.highestBid.amount >= amount) {
    throw new Forbidden(`Your bid must be higher than ${auction.highestBid.amount}!`);
  }

  try {
    const { Attributes: updatedAuction } = await dynamodb.update({
      TableName,
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

export const handler = commonMiddleware(placeBid);
