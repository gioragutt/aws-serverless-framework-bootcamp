import { InternalServerError, NotFound } from 'http-errors';

export async function getAuctionById(dynamodb, id) {
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
    throw new NotFound(`Auction with ID "${id}" not found`);
  }

  return auction;
}