import AWS from 'aws-sdk';
import { InternalServerError, NotFound } from 'http-errors';

export const dynamodb = new AWS.DynamoDB.DocumentClient();

export const TableName = process.env.AUCTIONS_TABLE_NAME;

export async function getEndedAuctions() {
  const now = new Date();

  const result = await dynamodb.query({
    TableName,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status AND endingAt <= :now',
    ExpressionAttributeValues: {
      ':status': 'OPEN',
      ':now': now.toISOString(),
    },
    ExpressionAttributeNames: {
      '#status': 'status', // status is a reserved keyword, so this make it work for runtime
    }
  }).promise();

  return result.Items;
}

export async function createAuction(auction) {
  try {
    return dynamodb.put({
      TableName,
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