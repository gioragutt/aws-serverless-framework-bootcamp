import AWS from 'aws-sdk';
import { InternalServerError, NotFound } from 'http-errors';

export const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function createAuction(auction) {
  try {
    return dynamodb.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction,
    }).promise();
  } catch (e) {
    console.error(e);
    throw new InternalServerError(e);
  }
}

export async function getAuctionById(id) {
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