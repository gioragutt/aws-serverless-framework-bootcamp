import validator from '@middy/validator';
import commonMiddleware from '../lib/commonMiddleware';
import { getAuctionsByStatus } from '../lib/getAuctionsByStatus';
import { getAuctionsSchema } from '../lib/schemas/getAuctionsSchema';

async function getAuctions(event) {
  const { status } = event.queryStringParameters;

  const auctions = await getAuctionsByStatus(status);

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = commonMiddleware(getAuctions)
  .use(validator({ inputSchema: getAuctionsSchema, useDefaults: true }));
