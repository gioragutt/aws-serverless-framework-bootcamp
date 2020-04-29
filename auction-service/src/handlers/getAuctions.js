import { InternalServerError } from 'http-errors';
import commonMiddlware from '../lib/commonMiddleware';
import { dynamodb } from '../lib/db';

async function getAuctions() {
  try {
    const { Items: auctions } = await dynamodb.scan({
      TableName: process.env.AUCTIONS_TABLE_NAME,
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

export const handler = commonMiddlware(getAuctions);
