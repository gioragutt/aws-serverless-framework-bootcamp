import { InternalServerError, NotFound } from 'http-errors';
import { dynamodb, TableName } from './db';

export async function getAuctionById(id) {
  let auction;

  try {
    const result = await dynamodb.get({
      TableName,
      Key: { id },
    }).promise();

    auction = result.Item;
  } catch (e) {
    console.error(e);
    throw new InternalServerError(e);
  }

  if (!auction) {
    throw new NotFound(`Auction with ID "${id}" not found`);
  }

  return auction;
}
