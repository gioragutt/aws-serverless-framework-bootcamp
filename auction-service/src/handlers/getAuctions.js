import { BadRequest } from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';
import { getAuctionsByStatus } from '../lib/getAuctionsByStatus';

const validStatuses = ['OPEN', 'CLOSED'];

async function getAuctions(event) {
  let { status = 'OPEN' } = event.queryStringParameters;
  status = status.toUpperCase();

  if (!validStatuses.includes(status)) {
    throw new BadRequest(`Invalid status "${status}"`);
  }

  const auctions = await getAuctionsByStatus(status);

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = commonMiddleware(getAuctions);
