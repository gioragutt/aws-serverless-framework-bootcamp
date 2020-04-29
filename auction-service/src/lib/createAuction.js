import { InternalServerError } from 'http-errors';
import { dynamodb, TableName } from './db';

export async function createAuction(auction) {
  try {
    return dynamodb.put({
      TableName,
      Item: auction,
    }).promise();
  }
  catch (e) {
    console.error(e);
    throw new InternalServerError(e);
  }
}
