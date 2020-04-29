import { InternalServerError } from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';
import { dynamodb, TableName } from '../lib/db';

async function getAuctions() {
  try {
    const { Items: auctions } = await dynamodb.scan({
      TableName,
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(auctions),
    };
  } catch (e) {
    console.error(e);
    throw new InternalServerError(e);
  }
}

export const handler = commonMiddleware(getAuctions);
