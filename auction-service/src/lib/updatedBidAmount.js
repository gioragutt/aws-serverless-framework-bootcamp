import { InternalServerError } from 'http-errors';
import { dynamodb, TableName } from './db';

export async function updateBidAmount(auction, amount, bidder) {
  try {
    const result = await dynamodb.update({
      TableName,
      Key: { id: auction.id },
      UpdateExpression: 'set highestBid.amount = :amount, highestBid.bidder = :bidder',
      ExpressionAttributeValues: {
        ':amount': amount,
        ':bidder': bidder,
      },
      ReturnValues: 'ALL_NEW',
    }).promise();

    return result.Attributes;
  } catch (e) {
    console.error(e);
    throw new InternalServerError(e);
  }
}